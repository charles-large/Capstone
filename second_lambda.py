import json

# Price, Resolution, Purpose

gpu_dict = {"NVIDIA GeForce RTX 3090": {"Price": 1499, "Memory": "24GB GDDR6X", "Rank": 1, "1440": True, "2560":True},
            "AMD Radeon RX 6900 XT": {"Price": 999, "Memory": "16GB GDDR6", "Rank": 2, "1440": True, "2560":True},
            "AMD Radeon RX 6800 XT": {"Price": 649, "Memory": "16GB GDDR6", "Rank": 3, "1440": True, "2560":True},
            "NVIDIA GeForce RTX 3080": {"Price": 799, "Memory": "10GB GDDR6X", "Rank": 4, "1440": True, "2560":True},
            "AMD Radeon RX 6800": {"Price": 579, "Memory": "16GB GDDR6", "Rank": 5, "1440": True, "2560":True},
            "NVIDIA GeForce RTX 3070": {"Price": 499, "Memory": "8GB GDDR6", "Rank": 7, "Score": 76.3},
            "AMD Radeon RX 6700 XT": {"Price": 479, "Memory": "12GB GDDR6", "Rank": 8, "1440": True, "2560":False},
            "NVIDIA GeForce RTX 3060 Ti": {"Price": 399, "Memory": "8GB GDDR6", "Rank": 9, "1440": True, "2560":False},
            "NVIDIA GeForce RTX 3060 12GB": {"Price": 329, "Memory": "12GB GDDR6", "Rank": 15, "1440": True, "2560":False},
            "AMD Radeon RX 5700": {"Price": 349, "Memory": "8GB GDDR6", "Rank": 16, "1440": True, "2560":False},
            "AMD Radeon RX 5600 XT": {"Price": 299, "Memory": "6GB GDDR6", "Rank": 18, "1440": True, "2560":False},
            "NVIDIA GeForce GTX 1660 Ti": {"Price": 249, "Memory": "6GB GDDR5", "Rank": 18, "1440": True, "2560":False},
            "NVIDIA GeForce GTX 1660": {"Price": 229, "Memory": "6GB GDDR5", "Rank": 19, "1440": False, "2560":False},
            "AMD Radeon RX 5500 XT 8GB": {"Price": 199, "Memory": "8GB GDDR6", "Rank": 20, "1440": False, "2560":False},
            "NVIDIA GeForce GTX 1650": {"Price": 159, "Memory": "4GB GDDR5", "Rank": 21, "1440": False, "2560":False},
            }
cpu_dict = {"AMD Ryzen 9 5900X": {"Price": 550, "Cores/Threads": "12/24", "Base/Boost GHz": "3.7 / 4.8", "Score": 100},
"AMD Ryzen 9 5950X": {"Price": 800, "Cores/Threads": "16/32", "Base/Boost GHz": "3.4 / 4.9", "Score": 97.22},
"AMD Ryzen 7 5800X": {"Price": 450, "Cores/Threads": "8/16", "Base/Boost GHz": "3.8 / 4.7", "Score": 97.21},
"AMD Ryzen 5 5600X": {"Price": 300, "Cores/Threads": "6/12", "Base/Boost GHz": "3.7 / 4.6", "Score": 96.9},
"Intel Core i9-10900K": {"Price": 490, "Cores/Threads": "10/20", "Base/Boost GHz": "3.7 / 5.3", "Score": 88.97},
"Intel Core i7-10700K": {"Price": 375, "Cores/Threads": "8/16", "Base/Boost GHz": "3.8 / 5.1", "Score": 84.39},
"Intel Core i7-9700K": {"Price": 385, "Cores/Threads": "8/8", "Base/Boost GHz": "3.6 / 4.9", "Score": 79.09},
"AMD Ryzen 5 3600X": {"Price": 299, "Cores/Threads": "6/12", "Base/Boost GHz": "3.8 / 4.4", "Score": 73.91},
"AMD Ryzen 3 3300X": {"Price": 190, "Cores/Threads": "4/8", "Base/Boost GHz": "3.8 / 4.3", "Score": 72.67},
"AMD Ryzen 3 3100": {"Price": 180, "Cores/Threads": "4/8", "Base/Boost GHz": "3.6 / 3.9", "Score": 61.89}}

def closest(name_list, k):
    """Returns the closest value to a given value from a list"""
    return name_list[min(range(len(name_list)), key=lambda i: abs(name_list[i] - k))]

def calcGpu(gpu_price, cpu_price, gpu_brand, cpu_brand, user_resolution="1080"):
    """Calculates the gpu and cpu to reccomend taking account for the price,
    brand and resolution desired"""
    gpu_lst = []
    cpu_lst = []
    final_values = []
    
    
    if gpu_brand != "Either":
        """If a preference for graphics card was provided"""
        for entry in gpu_dict.keys():
            if gpu_brand in entry:
                gpu_lst.append(gpu_dict[entry]["Price"])
        gpu_lst.sort()
        new_value = closest(gpu_lst, gpu_price)
    elif gpu_brand == "Either":
        """If no preference for graphics card was provided"""
        for entry in gpu_dict.keys():
            gpu_lst.append(gpu_dict[entry]["Price"])
        gpu_lst.sort()
        print(gpu_brand)
        print(gpu_lst)
        print(gpu_price)
        new_value = closest(gpu_lst, gpu_price)
        
    for entry in gpu_dict.keys():
        """Append Graphics card selection to final values list"""
        if gpu_dict[entry]["Price"] == new_value:
            gpu_dict[entry]["Name"] = str(entry)
            final_values.append(gpu_dict[entry])
    
    if cpu_brand != "Either":
        """If a preference for CPU was provided"""
        for entry in cpu_dict.keys():
            if cpu_brand in entry:
                cpu_lst.append(cpu_dict[entry]["Price"])
        cpu_lst.sort()
        new_value = closest(cpu_lst, cpu_price)
    elif cpu_brand == "Either":
        """If no preference for CPU was provided"""
        for entry in cpu_dict.keys():
            cpu_lst.append(cpu_dict[entry]["Price"])
        cpu_lst.sort()
        new_value = closest(cpu_lst, cpu_price)
    
    for entry in cpu_dict.keys():
        """Append CPU selection to final values list"""
        if cpu_dict[entry]["Price"] == new_value:
            cpu_dict[entry]["Name"] = str(entry)
            final_values.append(cpu_dict[entry]) 
    
    """Checks if GPU supports resolution provided"""
    if user_resolution != "1080":
        if final_values[0][user_resolution] == True:
            moreFunds = False
        else:
            moreFunds = True
    elif user_resolution == "1080":
        moreFunds = False
    
    """Returns a json response of gpu dict values and cpu dict values.
    Also including a boolean whether the resolution requirements are met"""
    
    return_value = {
        'value': {
            'GPU': final_values[0],
            'CPU': final_values[1],
            'Funds': moreFunds
            }
    }
    value = json.dumps(return_value)
    print(value)
    return value


def purposeGaming(price, res, brand_pref_graphics, brand_pref_cpu):
    
    """Calculates the price in tiers for the purpose gaming"""
    
    if price >= 1500:
        adjusted_price = price - 500
        gpu_share = .7 * adjusted_price
        cpu_share = .3 * adjusted_price
        return calcGpu(gpu_share, cpu_share, brand_pref_graphics, brand_pref_cpu, user_resolution=res)
    elif 1500 > price >= 1000:
        adjusted_price = price - 400
        gpu_share = .65 * adjusted_price
        cpu_share = .35 * adjusted_price
        return calcGpu(gpu_share, cpu_share, brand_pref_graphics, brand_pref_cpu, user_resolution=res)
    elif 1000 > price >= 800:
        adjusted_price = price - 350
        gpu_share = .65 * adjusted_price
        cpu_share = .35 * adjusted_price
        return calcGpu(gpu_share, cpu_share, brand_pref_graphics, brand_pref_cpu, user_resolution=res)
    elif 800 > price >= 500:
        adjusted_price = price - 300
        gpu_share = .6 * adjusted_price
        cpu_share = .4 * adjusted_price
        return calcGpu(gpu_share, cpu_share, brand_pref_graphics, brand_pref_cpu, user_resolution=res)
    elif price < 500:
        adjusted_price = price - 250
        gpu_share = .6 * adjusted_price
        cpu_share = .4 * adjusted_price
        return calcGpu(gpu_share, cpu_share, brand_pref_graphics, brand_pref_cpu, user_resolution=res)


def purposeStreaming(price, res, brand_pref_graphics, brand_pref_cpu):
    """Calculates the price in tiers for the purpose streaming"""
    if price >= 1500:
        adjusted_price = price - 500
        gpu_share = .7 * adjusted_price
        cpu_share = .3 * adjusted_price
        return calcGpu(gpu_share, cpu_share, brand_pref_graphics, brand_pref_cpu, user_resolution=res)
    elif 1500 > price >= 1000:
        adjusted_price = price - 400
        gpu_share = .65 * adjusted_price
        cpu_share = .35 * adjusted_price
        return calcGpu(gpu_share, cpu_share, brand_pref_graphics, brand_pref_cpu, user_resolution=res)
    elif 1000 > price >= 800:
        adjusted_price = price - 350
        gpu_share = .6 * adjusted_price
        cpu_share = .4 * adjusted_price
        return calcGpu(gpu_share, cpu_share, brand_pref_graphics, brand_pref_cpu, user_resolution=res)
    elif 800 >= price:
        adjusted_price = price - 300
        gpu_share = .55 * adjusted_price
        cpu_share = .45 * adjusted_price
        return calcGpu(gpu_share, cpu_share, brand_pref_graphics, brand_pref_cpu, user_resolution=res)


def purposeMining(price, res, brand_pref_graphics, brand_pref_cpu):
    """Calculates the price in tiers for the purpose mining"""
    if price >= 1500:
        adjusted_price = price - 500
        gpu_share = .85 * adjusted_price
        cpu_share = .15 * adjusted_price
        return calcGpu(gpu_share, cpu_share, brand_pref_graphics, brand_pref_cpu, user_resolution=res)
    elif 1500 > price >= 1000:
        adjusted_price = price - 400
        gpu_share = .8 * adjusted_price
        cpu_share = .2 * adjusted_price
        return calcGpu(gpu_share, cpu_share, brand_pref_graphics, brand_pref_cpu, user_resolution=res)
    elif 1000 > price >= 800:
        adjusted_price = price - 350
        gpu_share = .75 * adjusted_price
        cpu_share = .25 * adjusted_price
        return calcGpu(gpu_share, cpu_share, brand_pref_graphics, brand_pref_cpu, user_resolution=res)
    elif 800 >= price:
        adjusted_price = price - 300
        gpu_share = .7 * adjusted_price
        cpu_share = .3 * adjusted_price
        return calcGpu(gpu_share, cpu_share, brand_pref_graphics, brand_pref_cpu, user_resolution=res)

def lambda_handler(event, context):
    
    
    # purpose = 'gaming'
    # price = 870
    # resolution = '2560'
    
    purpose = event['purpose']
    price = event['budget']
    resolution = event['resolution']
    brand_pref_graphics = event['brand_preference_graphics']
    brand_pref_cpu = event['brand_preference_cpu']
    
    print("CPU: " + brand_pref_cpu)
    print("GPU: " +brand_pref_graphics)

    if purpose == "gaming":
        return purposeGaming(price, resolution, brand_pref_graphics, brand_pref_cpu)
    elif purpose == "streaming":
        return purposeStreaming(price, resolution, brand_pref_graphics, brand_pref_cpu)
    elif purpose == "mining":
        return purposeMining(price, "1080", brand_pref_graphics, brand_pref_cpu)
