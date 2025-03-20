import time
import random
import psutil
import os

def sequential_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

arr = [random.randint(1, 1000) for _ in range(1000)]
target = random.choice(arr)
start_time = time.time()

process = psutil.Process(os.getpid())
mem_before = process.memory_info().rss / 1024  # Convertir a KB

sequential_search(arr, target)

mem_after = process.memory_info().rss / 1024  # Convertir a KB
end_time = time.time()

print(f"{end_time - start_time},{mem_after - mem_before}")
