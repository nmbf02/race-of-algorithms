import time
import random
import psutil
import os

def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key

arr = [random.randint(1, 1000) for _ in range(1000)]
start_time = time.time()

process = psutil.Process(os.getpid())
mem_before = process.memory_info().rss / 1024  # Convertir a KB

insertion_sort(arr)

mem_after = process.memory_info().rss / 1024  # Convertir a KB
end_time = time.time()

print(f"{end_time - start_time},{mem_after - mem_before}")
