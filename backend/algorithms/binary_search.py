import time
import random
import psutil
import os

def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

arr = sorted([random.randint(1, 1000) for _ in range(1000)])  # Ordenamos el array
target = random.choice(arr)
start_time = time.time()

process = psutil.Process(os.getpid())
mem_before = process.memory_info().rss / 1024  # Convertir a KB

binary_search(arr, target)

mem_after = process.memory_info().rss / 1024  # Convertir a KB
end_time = time.time()

print(f"{end_time - start_time},{mem_after - mem_before}")
