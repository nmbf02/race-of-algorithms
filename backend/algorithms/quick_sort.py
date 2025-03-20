import time
import random
import psutil
import os

def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

arr = [random.randint(1, 1000) for _ in range(1000)]
start_time = time.time()

process = psutil.Process(os.getpid())
mem_before = process.memory_info().rss / 1024  # Convertir a KB

sorted_arr = quick_sort(arr)

mem_after = process.memory_info().rss / 1024  # Convertir a KB
end_time = time.time()

print(f"{end_time - start_time},{mem_after - mem_before}")
