import scrapy
import re
from scrapy.crawler import CrawlerProcess
import pymongo
from apscheduler.schedulers.twisted import TwistedScheduler

class MySpider(scrapy.Spider):
    name = "quotes"

    def start_requests(self):

        urls = [
            'https://www.detik.com/terpopuler'
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        articles = response.xpath("//article")

        for article in articles:
            title = article.xpath("div[@class='media media--left media--image-radius block-link']/div[@class='media__text']/h3/a/text()").get()
            link = article.xpath("div[@class='media media--left media--image-radius block-link']/div[@class='media__text']/h3/a/@href").get()
            yield scrapy.Request(url=link, callback=self.parse_detail_page)
            

        yield { "articles_number" : len(articles) }
    
    def parse_detail_page(self, response):
        connection = pymongo.MongoClient("mongodb://localhost:27017/")

        title = response.xpath("//article[@class='detail']/div[@class='detail__header']/h1/text()").get()
        paragraphs = response.xpath("//div[@class='detail__body itp_bodycontent_wrapper']/div[@class='detail__body-text itp_bodycontent']/p/text()").extract()
        
        if(paragraphs == None):
            return

        content = ""
        for paragraph in paragraphs:
            content = content + paragraph

        database = connection["scrapingdb"]
        collection = database["detik_articles"]

        collection.insert_one({
            "title":title,
            "content":content,
            "url": response.url
        })

        connection.close()
        yield { "message" : f"success: {response.url}" }


process = CrawlerProcess()
# process.crawl(MySpider)
# process.start() 
scheduler = TwistedScheduler()
scheduler.add_job(process.crawl, 'interval', args=[MySpider], seconds=5)
scheduler.start()
process.start(False)