from datetime import datetime
from collections import defaultdict
from mpi4py import MPI
import json
import re
import operator

# initialized

start = datetime.now()
words = defaultdict(int)
comm = MPI.COMM_WORLD
rank = comm.Get_rank()
nodes = comm.Get_size()
removed_words = ['https','http','di','yang', 's','t','co','dan','ini','r']
NUM_OF_LINES = 10
DATA_TAG = 48
NO_DATA_TAG = 0

# functions
def clean(sentence):
    sentence = re.sub("@[^\\s]+", '', sentence) # remove @username
    sentence = re.sub("#[^\\s]+", '', sentence)  # remove #hashtag
    sentence = re.sub(r"[^a-zA-Z0-9]+", ' ', sentence) # remove all special char
    for removed_word in removed_words:
        sentence = sentence.lower().replace(removed_word,'')
    return sentence # lowercase

def count_words(contents):
    for content in contents:
        sentence = clean(content['text'])
        for word in sentence.split():
            words[word] += 1
    return words

# main program
if rank == 0:
    start = datetime.now()
    print(f"rank: {rank} started at {start}")
    workers = nodes - 1
    count = 0
    count_lines = 1
    with open('responses.json', "r") as fin:
        contents = []
        for i, line in enumerate(fin):
            count_lines += 1
            try:
                contents.append(line.strip())
                if (i+1) % NUM_OF_LINES == 0:
                    comm.send({'data' : contents}, dest=(count%workers + 1), tag=DATA_TAG)
                    count += 1
                    contents = []
            except Exception as err:
                print(f"ERROR: {err} -> Line {i}")
        comm.send({'message' : 'no data'}, dest=(count%workers + 1), tag=NO_DATA_TAG)
    
    workers_results = []
    for i in range(workers):
        data = comm.recv(source=(i + 1), tag=DATA_TAG) 
        workers_results.append(data)
    
    results = {}
    for workers_result in workers_results:
        for key, value in workers_result.items():
            # print(f'key: {key} value: {value}')
            if(key in results):
                results[key] += value
            else:
                results[key] = value
    file = open('result.json', 'w')
    file.write(json.dumps(words))
    file.close()
    end = datetime.now()
    print(f"rank: {rank} ended at {end}, processing {count_lines} lines in {end - start} ms")
else:
    start = datetime.now()
    print(f"rank: {rank} started at {start}")
    contents = []
    while True:
        s = MPI.Status()
        comm.Probe(status=s)
        data = comm.recv(source=0, tag=s.tag)
        if s.tag == DATA_TAG:
            lines = data['data']
            for line in lines:
                try:
                    content_json = json.loads(line)
                    contents.append(content_json)
                except Exception as err:
                    print(f"ERROR: {err} -> Line: {text}")
        if s.tag == NO_DATA_TAG:
            words = count_words(contents)
            words = sorted_d = dict( sorted(words.items(), key=operator.itemgetter(1),reverse=True))
            comm.send(words, dest=0, tag=DATA_TAG)
            break
    end = datetime.now()
    print(f"rank: {rank} ended at {end}, processing time: {end - start}")