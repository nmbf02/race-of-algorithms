import time
import random
import psutil
import os

def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]

arr = [random.randint(1, 1000) for _ in range(1000)]
start_time = time.time()

# Medir memoria antes y después
process = psutil.Process(os.getpid())
mem_before = process.memory_info().rss / 1024  # Convertir a KB

bubble_sort(arr)

mem_after = process.memory_info().rss / 1024  # Convertir a KB
end_time = time.time()

# Mostrar tiempo y memoria usada
print(f"{end_time - start_time},{mem_after - mem_before}")
