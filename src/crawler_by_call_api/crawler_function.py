from os import read
import requests
import json
import csv
import numpy as np
import pandas as pd
from bs4 import BeautifulSoup
import time
import json
from crawler_by_call_api.utils import read_json_file
from slugify import slugify


def get_header():
    headers = dict()
    headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    headers['Accept-Encoding'] = 'gzip, deflate, sdch'
    headers['Accept-Language'] = 'en-US,en;q=0.8,vi;q=0.6'
    headers['Connection'] = 'keep-alive'
    headers['Upgrade-Insecure-Requests'] = '1'
    headers['User-Agent'] = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36'
    return headers


def get_content_by_link(url):
    r = requests.get(url, headers=get_header(), timeout=10)
    r.encoding = 'utf-8'
    r.close()
    return str(r.text)

def crawl_food_slugs(url):
    item_slugs = []
    try:
        raw_content = get_content_by_link(url)
        beautiful_soup = BeautifulSoup(raw_content, 'html.parser')
        
        available_boxes = beautiful_soup.find_all('div', class_="block_menu_item")
        for available_box in available_boxes[7:10]:
            food_boxes = available_box.find_all('div', class_='menu_item_image')
            for food_box in food_boxes:
                food_url = food_box.find('a', href=True)['href']
                slug = food_url.split('/')[2]
                item_slugs.append(slug)
            
        return item_slugs
    except Exception:
        return []

def crawl_food_detail_by_slug(detail_url, slug):
    id = -1
    name = -1
    description = -1
    image = -1
    price = -1
    createdAt = time.time()
    updatedAt = time.time()
    meta = {
        "votes": 0,
        'favs': 0
    }
    url = detail_url.format(slug)
    raw_content = get_content_by_link(url)
    beautiful_soup = BeautifulSoup(raw_content, 'html.parser')
    
    name = beautiful_soup.find('h1', class_="info_product_title line_after_heading").text
    description = beautiful_soup.find('div', class_="product_info_tab").find('p').text
    image = beautiful_soup.find('img', class_="product_featured_image").get('src')
    id = image.split('/')[3]
    price = beautiful_soup.find('span', class_="price")['data-price']

        
    item_detail = {
        "id": id,
        "name": name,
        "description": description,
        "image": image,
        "price": price,
        "slug": slug,
        "createdAt": createdAt,
        "updatedAt": updatedAt,
        "meta": meta
    }

    return item_detail

# Số trang cần lấy với từng category


def crawl_book_ids(id_list_by_category_api, pages=1):
    item_ids = []
    for i in range(pages):
        payload = {}
        params = {
            'page': i + 1
        }

        response = requests.request(
            "GET", id_list_by_category_api, headers=get_header(), data=payload, params=params)
        response_json = response.json()

        for item in response_json["data"]:
            item_ids.append([item['id']])

        i = i + 1
    return item_ids




def crawl_book_detail_by_id(detail_by_item_id_api, item_id):
    id = -1
    title = -1
    author = -1
    description = -1
    image = -1
    body = -1
    price = -1
    no = -1
    slug = -1
    createdAt = time.time()
    updatedAt = time.time()
    meta = {
        "votes": 0,
        'favs': 0
    }
    payload = {}
    
    response = requests.get(detail_by_item_id_api.format(
        item_id[0]), headers=get_header(), data=payload)
    
    if response.status_code == 200:
        response_json = response.json()
        id = response_json['id']
        title = response_json['name']
        if 'authors' in response_json:
            author = response_json['authors'][0]["name"]
            
        description = BeautifulSoup(response_json['short_description'], features="lxml").get_text()
        if 'images' in response_json:
            image = response_json['images'][0]["base_url"]
        price = response_json['price']
        body = BeautifulSoup(response_json['description'], features="lxml").get_text()
        if 'specifications' in response_json:
            for spec in response_json['specifications']:
                if "attributes" in spec:
                    attributes = spec["attributes"]
                    for attr in attributes:
                        if attr["code"] == "number_of_page":
                            no = int(attr["value"])
                            
                        if author == -1 and attr["code"] == "dich_gia":
                            author = "Dịch giả " + attr["value"]
                        
        slug = response_json['url_key']

    item_detail = {
        "id": id,
        "title": title,
        "author": author,
        "description": description,
        "image": image,
        "body": body,
        "price": price,
        "no": no,
        "slug": slug,
        "createdAt": createdAt,
        "updatedAt": updatedAt,
        "meta": meta,
    }

    return item_detail

def crawl_coffee_slugs(slug_list_by_category_api):
    item_slugs = []
    payload = {}
    response = requests.post(slug_list_by_category_api, headers=get_header(), data=payload)
   
    if response.status_code == 200:
        response_json = response.json()
    else:
        response_json = read_json_file('crawler_by_call_api/support_no_api/data_json/coffeehouse_menu.json')
    menu = response_json["menu"]
    for category in menu:
        if category["name"] == "Cà phê":
            coffee = category["products"]
            for item in coffee:
                item_slugs.append(slugify(item["name"], to_lower=True))
            break
    
    return item_slugs

def get_coffee_detail_json_by_slug(slug):
    response_json = read_json_file('./crawler_by_call_api/support_no_api/data_json/coffeehouse_menu.json')
    res = {}
    menu = response_json["menu"]
    
    for category in menu:
        if category["name"] == "Cà phê":
            coffee = category["products"]
            for i in coffee:
                if i["slug"] == slug:
                    res = i
                    break
    
    return {"product": res}

def crawl_coffee_detail_by_slug(detail_by_slug_api, slug):
    id = -1
    name = -1
    description = -1
    image = -1
    price = -1
    createdAt = time.time()
    updatedAt = time.time()
    meta = {
        "votes": 0,
        'favs': 0
    }
    payload = {}
   
    response = requests.post(detail_by_slug_api.format(slug), headers=get_header(), data=payload)
    if response.status_code == 200:
        response_json = response.json()
    else:
        response_json = get_coffee_detail_json_by_slug(slug)  
    
    product = response_json["product"]
    id = product["id"]
    name = product["name"]
    if "description_html" in product and product["description_html"] != None:
        description = BeautifulSoup(product["description"] + '<br/>' + product["description_html"], features='lxml')
    else:
        description = product["description"]
    
    image = product["images"][0]
    price = product["price"]
    slug = product["slug"]
    
        
    item_detail = {
        "id": id,
        "name": name,
        "description": description,
        "image": image,
        "price": price,
        "slug": slug,
        "createdAt": createdAt,
        "updatedAt": updatedAt,
        "meta": meta
    }

    return item_detail