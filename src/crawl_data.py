import os
from crawler_by_call_api.yaml_utils import read_yaml
from crawler_by_call_api.crawler_function import crawl_book_ids, crawl_book_detail_by_id, crawl_coffee_slugs, crawl_coffee_detail_by_slug, crawl_food_slugs, crawl_food_detail_by_slug
from crawler_by_call_api.utils import write_csv_file, write_json_file
from tqdm import tqdm

book_api_containers = read_yaml('./api_containers/book_api_containers.yaml')
coffee_api_containers = read_yaml('./api_containers/coffee_api_containers.yaml')
food_containers = read_yaml('./api_containers/except_food_api_containers.yaml')

OUTPUT = '../data/crawl_data'
os.makedirs(OUTPUT, exist_ok=True)

def craw_books():

    for category, book_api_container in book_api_containers.items():
        category_dir = os.path.join(OUTPUT, category)
        os.makedirs(category_dir, exist_ok=True)

        id_list_api = book_api_container[0]
        detail_api = book_api_container[1]

        item_id_list_path = os.path.join(category_dir, 'item_ids.txt')
        item_detail_list_path = os.path.join(category_dir, 'books.json')

        item_id_list = crawl_book_ids(id_list_api, 3)
        write_csv_file(item_id_list, item_id_list_path, 'w')

        item_detail_list = []
        for id in item_id_list:
            detail = crawl_book_detail_by_id(detail_api, id)
            if (detail['author'] == -1):
                continue
            item_detail_list.append(detail)
        
        write_json_file(item_detail_list, item_detail_list_path, 'w')

def craw_coffee():

    for category, coffee_api_container in coffee_api_containers.items():
        category_dir = os.path.join(OUTPUT, category)
        os.makedirs(category_dir, exist_ok=True)

        slug_list_api = coffee_api_container[0]
        detail_api = coffee_api_container[1]

        coffee_slug_list_path = os.path.join(category_dir, 'item_slugs.txt')
        coffee_detail_list_path = os.path.join(category_dir, 'coffee.json')


        coffee_slug_list = crawl_coffee_slugs(slug_list_api)
        write_csv_file([coffee_slug_list], coffee_slug_list_path, 'w')

        print(coffee_slug_list)

        coffee_detail_list = []
        
        for slug in coffee_slug_list:
            detail = crawl_coffee_detail_by_slug(detail_api, slug)
            coffee_detail_list.append(detail)
        
        write_json_file(coffee_detail_list, coffee_detail_list_path, 'w')

    
# craw_coffee()


def crawl_food():
    for category, food_api_container in food_containers.items():
        category_dir = os.path.join(OUTPUT, category)
        os.makedirs(category_dir, exist_ok=True)

        slug_list_api = food_api_container[0]
        detail_api = food_api_container[1]

        food_slug_list_path = os.path.join(category_dir, 'item_slugs.txt')
        food_detail_list_path = os.path.join(category_dir, 'food.json')


        food_slug_list = crawl_food_slugs(slug_list_api)
        write_csv_file([food_slug_list], food_slug_list_path, 'w')



        food_detail_list = []
        
        for slug in food_slug_list:
            detail = crawl_food_detail_by_slug(detail_api, slug)
            print(detail['image'])
            food_detail_list.append(detail)
        
        write_json_file(food_detail_list, food_detail_list_path, 'w')
crawl_food()



