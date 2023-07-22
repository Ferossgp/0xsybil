
import numpy as np
import pandas as pd
from google.colab import drive

drive.mount('/content/drive')

import requests
import json

# Define the GraphQL query
query = '''
  query Votes($id: String!, $first: Int, $skip: Int, $orderBy: String, $orderDirection: OrderDirection, $reason_not: String, $voter: String, $space: String, $created_gte: Int) {
    votes(
      first: $first
      skip: $skip
      where: {proposal: $id, vp_gt: 0, voter: $voter, space: $space, reason_not: $reason_not, created_gte: $created_gte}
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ipfs
      voter
      choice
      vp
      vp_by_strategy
      reason
      created
    }
  }
'''

# Define the GraphQL endpoint URL
url = 'https://hub.snapshot.org/graphql'

# Set the headers and content type for the request
headers = {'Content-Type': 'application/json'}

# Define the request payload
payload = {
    'query': query,
    'operationName': 'Votes',
    'variables': {
        'id': '0x1275828152a7f044dca9768212b108df346cd04c0680cd3a6249e8e1f3adddbc',
        'first': 200,
        'skip': 0,
        'orderBy': 'vp',
        'orderDirection': 'desc'
    }
}

# Make the GraphQL request
response = requests.post(url, headers=headers, data=json.dumps(payload))

# Check the response status code
if response.status_code == 200:
    # Parse the response JSON data
    data = response.json()

   # Process the response data and save it in a DataFrame
    votes = data['data']['votes']
    snapshot_df = pd.DataFrame(votes, columns=['voter', 'choice', 'created'])

    # Display the DataFrame
    print(snapshot_df.head())
else:
    print('GraphQL request failed with status code:', response.status_code)

#@title Default title text
pd.set_option('display.max_colwidth', -1)

def save_results(results, fname):

  file_path = f'/content/drive/MyDrive/Colab Notebooks/{fname}'

  # Check if the file exists
  if os.path.exists(file_path):
      # If the file exists, append the DataFrame to it
      existing_df = pd.read_csv(file_path)
      updated_df = existing_df.append(results, ignore_index=True)
      updated_df.to_csv(file_path, index=False)
  else:
      # If the file does not exist, create a new one and save the DataFrame
      results.to_csv(file_path, index=False)


def save_compared(data):
  file_path =  f'/content/drive/MyDrive/Colab Notebooks/compared.json'

  if os.path.exists(file_path):
    # If the file exists, read its content
    with open(file_path, 'r') as file:
        existing_data = json.load(file)

    # Append the new data to the existing data
    existing_data.update(data)

    # Save the updated data back to the file
    with open(file_path, 'w') as file:
        json.dump(existing_data, file)
  else:
        # If the file does not exist, create it with the initial data
    with open(file_path, 'w') as file:
      json.dump(data, file)


def read_json(fname):
    file_path =  f'/content/drive/MyDrive/Colab Notebooks/{fname}'
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

import numpy as np
class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

def save_json(data, fname):
  file_path =  f'/content/drive/MyDrive/Colab Notebooks/{fname}.json'
  with open(file_path, 'w') as file:
    json.dump(data, cls=NpEncoder, fp=file)

def read_csv(fname):
    file_path =  f'/content/drive/MyDrive/Colab Notebooks/{fname}'
    if os.path.exists(file_path):

      df = pd.read_csv(file_path)
      return df
    else:
      return None

import requests
import json
import os
from datetime import datetime, timedelta

def save_wallet_transactions(wallet_address):
  # Transform the wallet address to lowercase
  wallet_address = wallet_address.lower()

  # Define the base URL
  base_url = f''

  # Define the folder path using the wallet address
  folderpath = f'/content/drive/MyDrive/Colab Notebooks'

  # Create the folder if it does not exist
  if not os.path.exists(folderpath):
      os.makedirs(folderpath)

  # Define the file path and name
  filepath = os.path.join(folderpath, f'{wallet_address}.json')

  # Define the headers for the request
  headers = {
      'accept': 'application/json',
  }

  # Define the datetime threshold (2 years ago)
  threshold = datetime.now() - timedelta(days=365 * 2)

  # Initialize the URL
  url = base_url

  data_array = []

  while url:
      # Make the HTTP request
      response = requests.get(url, headers=headers)

      # Check if the request was successful (status code 200)
      if response.status_code == 200:
          # Parse the JSON response
          data = response.json()

          # Append the data from the current response to the data array
          data_array.extend(data['data'])

          # Check if the "mined_at" field is less than the threshold
          if 'next' not in data['links']:
            break

          mined_at = datetime.fromisoformat(data['data'][-1]['attributes']['mined_at'][:-1])
          # Check if the "next" field exists and "mined_at" is less than the threshold
          if mined_at < threshold:
              break

          # Update the URL using the "next" field
          url = data['links']['next']
      else:
          print('HTTP request failed with status code:', response.status_code)
          break

  # Save the data array to a JSON file
  with open(filepath, 'w') as file:
      json.dump(data_array, file)

  print(f'Data array saved successfully.')

# save_wallet_transactions('0x26871939DD1f1F2652906C5bf1Df6975EFF32910')
# save_wallet_transactions('0x4b6010E92d87C7C8393EF1a0D8BE1b30FAd6a9A2')
subset = snapshot_df['voter'].head(178).tail(22)
subset.apply(save_wallet_transactions)

desired_fields = [
    "type",
    "attributes.operation_type",
    "attributes.hash",
    "attributes.mined_at",
    "attributes.sent_from",
    "attributes.sent_to",
    "attributes.transfers.0.nft_info.contract_address",
    "attributes.transfers.0.nft_info.token_id",
    "attributes.transfers.0.nft_info.name",
    "attributes.transfers.0.nft_info.interface",
    "attributes.transfers.0.fungible_info.name",
    "attributes.transfers.0.fungible_info.symbol",
    "attributes.transfers.0.fungible_info.flags.verified",
    "attributes.transfers.0.direction",
    "attributes.transfers.0.quantity.numeric",
    "attributes.transfers.0.value",
    "attributes.transfers.0.price",
    "attributes.transfers.0.sender",
    "attributes.transfers.0.recipient",
    "attributes.transfers.1.fungible_info.name",
    "attributes.transfers.1.fungible_info.symbol",
    "attributes.transfers.1.fungible_info.flags.verified",
    "attributes.transfers.1.direction",
    "attributes.transfers.1.quantity.numeric",
    "attributes.transfers.1.value",
    "attributes.transfers.1.price",
    "attributes.transfers.1.sender",
    "attributes.transfers.1.recipient",
    "relationships.chain.data.id"
]

import pandas as pd
import json
import warnings

# Ignore all warnings
warnings.filterwarnings('ignore')

def add_json_values_to_dataframe(desired_fields, json_object, data_frame, wallet_address):
    def get_value(obj, path):
        try:
            value = obj
            for key in path.split('.'):
                if key.isdigit():
                    key = int(key)
                value = value[key]
            return value
        except (KeyError, IndexError):
            return None

    row = {'wallet_address': wallet_address}
    for field in desired_fields:
        value = get_value(json_object, field)
        row[field] = value


    if data_frame.empty:
        data_frame = pd.DataFrame([row])
    else:
        data_frame = data_frame.append(row, ignore_index=True)

    return data_frame


def read_all_files(wallet_address):
    wallet_address = wallet_address.lower()

    file_path = f'/content/drive/MyDrive/Colab Notebooks/{wallet_address}.json'

    rescsv = read_csv(f'{wallet_address}.csv')
    if rescsv is not None:
      return rescsv

    # Create the folder if it does not exist
    if not os.path.exists(file_path):
        return

    with open(file_path, 'r') as file:
        json_string = file.read()

    json_object = json.loads(json_string)
    new_df = pd.DataFrame()
    for item in json_object:
      if item['attributes']['transfers']:
        new_df = add_json_values_to_dataframe(desired_fields, item, new_df, wallet_address)


    save_results(new_df, f'{wallet_address}.csv')
    return new_df

import pandas as pd
from datetime import timedelta

def find_similar_transactions(data_frame, wallet_address, threshold=0.95):
    wallet_address = wallet_address.lower()
    similar_transactions = pd.DataFrame()

    # Filter the DataFrame based on the specified wallet address
    wallet_df = data_frame[data_frame['wallet_address'] == wallet_address]
    not_wallet_df = data_frame[data_frame['wallet_address'] != wallet_address]

    # Iterate over each row in the wallet-specific DataFrame
    for _, row in wallet_df.iterrows():
        # Filter the DataFrame based on the criteria
        filtered_df = not_wallet_df[
            (not_wallet_df['relationships.chain.data.id'] == row['relationships.chain.data.id']) &
            (not_wallet_df['attributes.operation_type'] == row['attributes.operation_type']) &
            (not_wallet_df['attributes.mined_at'] >= row['attributes.mined_at'] - timedelta(days=1)) &
            (not_wallet_df['attributes.mined_at'] <= row['attributes.mined_at'] + timedelta(days=1)) &
            (
                (
                    pd.isnull(not_wallet_df['attributes.transfers.0.nft_info.contract_address']) &
                    pd.isnull(row['attributes.transfers.0.nft_info.contract_address'])
                ) |
                (
                    not_wallet_df['attributes.transfers.0.nft_info.contract_address'] == row['attributes.transfers.0.nft_info.contract_address']
                )
            )
            &
            (
                (
                    pd.isnull(not_wallet_df['attributes.transfers.0.nft_info.name']) &
                    pd.isnull(row['attributes.transfers.0.nft_info.name'])
                ) |
                (
                    not_wallet_df['attributes.transfers.0.nft_info.name'] == row['attributes.transfers.0.nft_info.name']
                )
            )
            &
            (
                (
                    pd.isnull(not_wallet_df['attributes.transfers.0.nft_info.interface']) &
                    pd.isnull(row['attributes.transfers.0.nft_info.interface'])
                ) |
                (
                    not_wallet_df['attributes.transfers.0.nft_info.interface'] == row['attributes.transfers.0.nft_info.interface']
                )
            ) &
            (
                (
                    pd.isnull(not_wallet_df['attributes.transfers.0.fungible_info.symbol']) &
                    pd.isnull(row['attributes.transfers.0.fungible_info.symbol'])
                ) |
                (
                    not_wallet_df['attributes.transfers.0.fungible_info.symbol'] == row['attributes.transfers.0.fungible_info.symbol']
                )
            )
            &
            (
                (
                    pd.isnull(not_wallet_df['attributes.transfers.0.sender']) &
                    pd.isnull(row['attributes.transfers.0.sender'])
                ) |
                (
                    not_wallet_df['attributes.transfers.0.sender'] == row['attributes.transfers.0.sender']
                ) |
                 (
                    pd.isnull(not_wallet_df['attributes.transfers.0.recipient']) &
                    pd.isnull(row['attributes.transfers.0.recipient'])
                ) |
                (
                    not_wallet_df['attributes.transfers.0.recipient'] == row['attributes.transfers.0.recipient']
                )
            )

        ]


        # Iterate over the filtered DataFrame
        for _, other_row in filtered_df.iterrows():
            similar_transactions = similar_transactions.append({
            'og_hash': row['attributes.hash'],
            'og_wallet_address': wallet_address.lower(),
            'hash': other_row['attributes.hash'],
            'wallet_address': other_row['wallet_address'].lower(),
            'chain': row['relationships.chain.data.id']
        }, ignore_index=True)

    return similar_transactions



import os

wallet_addresses = snapshot_df['voter'].head(30)
compared_wallets = read_json('compared.json')
skip = ['0x92CBe89B5Cb1c22c2c16Bc465CaF34E3c80b617D']
# compared_wallets = {}

def display_results(results):
  og_wallet = results.iloc[0]['og_wallet_address']
  print('og_wallet', og_wallet)
  wallets = results['wallet_address'].unique()

  for value in wallets:
    count = (results['wallet_address'] == value).sum()
    print('related wallets', value, count)

def compare_wallet_with_others(wallets):
  og_wallet = wallets[0]

  for wallet in wallets:

    kw = og_wallet + '_' + wallet
    kw2 = wallet + '_' +  og_wallet


    if (kw not in compared_wallets) & (kw2 not in compared_wallets) & (og_wallet != wallet) & (og_wallet not in skip):
      print(kw)
      all_data = pd.DataFrame()
      df1 = read_all_files(og_wallet)
      df2 = read_all_files(wallet)
      # print(df1.shape)
      # print(df2.shape)

      all_data = pd.concat([df1, df2], ignore_index=True)

      all_data = all_data[(all_data['attributes.transfers.1.fungible_info.flags.verified'] != False)
          & (all_data['attributes.transfers.0.fungible_info.flags.verified'] != False)]
      all_data['attributes.mined_at'] = pd.to_datetime(all_data['attributes.mined_at'])

      similar_transactions = find_similar_transactions(all_data, og_wallet)

      if not similar_transactions.empty:
        display_results(similar_transactions)
        save_results(similar_transactions, 'results.csv')
        compared_wallets[kw] = True
        compared_wallets[kw2] = True
        save_compared(compared_wallets)
      else:
        compared_wallets[kw] = False
        compared_wallets[kw2] = False
        save_compared(compared_wallets)

import concurrent.futures
from functools import partial

def create_combinations(input_list):
    result = []
    n = len(input_list)

    for i in range(n):
        for j in range(i + 1, n):
            result.append([input_list[i], input_list[j]])

    return result

def create_combinations_with_next_n_elements(input_list, n):
    result = []
    for i in range(len(input_list) - n):
        for j in range(i + 1, i + 1 + n):
            result.append([input_list[i], input_list[j]])
    return result

# wallet_pairs = [['0x4b6010E92d87C7C8393EF1a0D8BE1b30FAd6a9A2', '0x26871939DD1f1F2652906C5bf1Df6975EFF32910'],
#                # Add more wallet pairs as needed
#                ]

os.environ['OMP_NUM_THREADS'] = str(2)

# wallet_pairs = create_combinations(snapshot_df['voter'].head(20))

wallet_pairs = create_combinations_with_next_n_elements(snapshot_df['voter'].head(60), 5)

your_function = compare_wallet_with_others

# # Example using ThreadPoolExecutor
# with concurrent.futures.ThreadPoolExecutor() as executor:
#     results = list(executor.map(your_function, wallet_pairs))

# Example using ProcessPoolExecutor
with concurrent.futures.ThreadPoolExecutor() as executor:
    results = list(executor.map(your_function, wallet_pairs))

# for p in wallet_pairs:
#   compare_wallet_with_others(p)

def get_explorer_link(row, column_name):
    transaction_hash = row[column_name]
    chain_name = row['chain']
    if chain_name == "ethereum":
        return f"https://etherscan.io/tx/{transaction_hash}"
    elif chain_name == "xdai":
        return f"https://gnosisscan.io/tx/{transaction_hash}"
    elif chain_name == "fantom":
        return f"https://ftmscan.com/tx/{transaction_hash}"
    elif chain_name == "polygon":
        return f"https://polygonscan.com/tx/{transaction_hash}"
    elif chain_name == "optimism":
        return f"https://optimistic.etherscan.io/tx/{transaction_hash}"
    elif chain_name == "arbitrum":
        return f"https://arbiscan.io/tx/{transaction_hash}"
    else:
        return "Unsupported chain"


# similar_transactions[similar_transactions['wallet_address']=='0x7152cd3891d5b80ca162bbb807e2d4310c084207']
similar_transactions['og_link'] = similar_transactions.apply(get_explorer_link, args=('og_hash',), axis=1)
similar_transactions['link'] = similar_transactions.apply(get_explorer_link, args=('hash',), axis=1)

poaps_cache = {}

#Poap comparisiosn
airstackapi_key = ''

def get_all_poaps(wallet):

  if (wallet in poaps_cache):
    return poaps_cache[wallet]

  # Define the GraphQL query
  query = '''
    query GetAllPOAPs($address: [Identity!]) {
    Poaps(input: {filter: {owner: {_in: $address}}, blockchain: ALL, limit: 200}) {
      Poap {
        eventId
        poapEvent {
          eventName
          eventURL
          country
          city
        }
      }
    }
  }
  '''

  # Define the GraphQL endpoint URL
  url = 'https://api.airstack.xyz/gql'

  # Set the headers and content type for the request
  headers = {
      'Content-Type': 'application/json',
      'authorization': airstackapi_key
  }

  # Define the request payload
  payload = {
      'query': query,
      'variables': {
          'address': wallet,
      }
  }

  # Make the GraphQL request
  response = requests.post(url, headers=headers, data=json.dumps(payload))

  # Check the response status code
  if response.status_code == 200:
      # Parse the response JSON data
      data = response.json()

      result = data['data']['Poaps']['Poap']

      poaps_cache[wallet] = result
      return result
  else:
      print('GraphQL request failed with status code:', response.status_code)

def find_equal_elements(list1, list2):
    count = 0

    for dict1 in list1:
        for dict2 in list2:
            if dict1 == dict2:
                count += 1
                break  # Once a match is found, move to the next dictionary in list1

    return count


poaps = get_all_poaps('0x26871939DD1f1F2652906C5bf1Df6975EFF32910')
poaps2 = get_all_poaps('0x4b6010E92d87C7C8393EF1a0D8BE1b30FAd6a9A2')

find_equal_elements(poaps, poaps2)

compared_poaps = {}

wallet_addresses = snapshot_df['voter'].head(200)
for og_wallet in wallet_addresses:
  for wallet in wallet_addresses:
    kw = og_wallet + '_' + wallet
    kw2 = wallet + '_' +  og_wallet

    if (kw not in compared_poaps) & (kw2 not in compared_poaps) & (og_wallet != wallet):
      compared_poaps[kw] = True
      compared_poaps[kw2] = True
      poaps = get_all_poaps(og_wallet)
      poaps2 = get_all_poaps(wallet)
      if (poaps is not None) & (poaps2 is not None):
        elements = find_equal_elements(poaps, poaps2)
        if (elements > 0):
          poaps_res = {'adress1': og_wallet, 'adress2': wallet, 'poaps': elements}
          res = pd.DataFrame([poaps_res])

          save_results(res, 'poaps2.csv')

connections = {}
all_pps = {}
pps = read_csv('poaps2.csv')
pps = pps[(pps['poaps'] > 5)]


for index, row in pps.iterrows():
    # Access row data using row['column_name'] or row[index]
    og_wallet = row['adress1'].lower()
    wallet = row['adress2'].lower()

    adress1 = row['adress1'].lower()
    adress2 = row['adress2'].lower()
    p = row['poaps']

    if (adress1 in connections):
      ll = connections[adress1]
      ll.append({"adress": adress2, "poaps": p, 'transactions': None})
      connections[adress1] = ll
    else:
      connections[adress1] = [{"adress": adress2, "poaps": p, 'transactions': None}]

    if (adress2 in connections):
      ll = connections[adress2]
      ll.append({"adress": adress1, "poaps": p})
      connections[adress2] = ll
    else:
      connections[adress2] = [{"adress": adress1, "poaps": p, 'transactions': None}]

res = read_csv('results.csv')

def update_dict_in_list(list_of_dicts, key_to_find, value_to_find, key_to_update, new_value):
    for dictionary in list_of_dicts:
        if key_to_find in dictionary and dictionary[key_to_find] == value_to_find:
            dictionary[key_to_update] = new_value
            return True
    return False

wallets = snapshot_df['voter']
final = {}
for w in wallets:
  og = w.lower()
  og_res = res[res['og_wallet_address'] == og]
  ss = og_res['wallet_address'].unique()
  print(og, ss.len())

  for value in ss:
    no_og = value.lower()
    count = (og_res['wallet_address'] == no_og).sum()
    if (count > 5):
      # print(og)
      if (og in connections):
        poaps_list = connections[og]
        new_poaps = update_dict_in_list(poaps_list, 'adress', no_og, 'transactions', count)
        connections[og] = poaps_list
      else:
          # poaps_list = connections[og]
          new_poaps = {'address': no_og, 'poaps': None, 'transactions': count}
          connections[og] = poaps_list


      if (no_og in connections):
        poaps_list = connections[no_og]
        new_poaps = update_dict_in_list(poaps_list, 'adress', og, 'transactions', count)
        connections[no_og] = poaps_list
      else:
          # poaps_list = connections[og]
          new_poaps = {'address': og, 'poaps': None, 'transactions': count}
          connections[no_og] = poaps_list

save_json(connections, 'final')
