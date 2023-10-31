"""
A Python file that filters the words_dictionary.json file
in order accord with the rules of GHOST.

Author - Tyler Yandt
"""

import json

# Test the program before reading over all 500k words in the dictionary
NUM_LINES_TO_READ = 50

# Open the JSON file
with open('original_words.json') as file:
    words_dict = json.load(file)
    words_list = list(words_dict.keys())
    filtered_words = []

    # iterate over the words in the .json file, and if that word has at least
    # 4 characters, add it back to the filtered word list
    for word in words_list:
        if len(word) >= 4:
            filtered_words.append(word)

# Open the frequency.txt file
# https://ucrel.lancs.ac.uk/bncfreq/flists.html
word_freq = {}
first_line = True
with open('word_freq.txt', 'r', encoding='ISO-8859-1') as file:
    lines = file.readlines()
    
    # Iterate over each word and its frequnecy
    for line in lines:
        # strip the line of leading and trailing white space characters
        words = line.strip().split("\t")

        # This is the header of the file, so we can pass over it
        if first_line:
            first_line = False
            continue
        
        # Filtering over some words that we don't need to include in the frequency list
        if words[1] == 'NoP' or words[1] == 'Num':
            continue

        word_freq[words[0]] = words[-1]

# the words in the freq list
freq_words = list(word_freq.keys())

word_dictionary = {}
# write the filtered word list back to the .json file
with open('words_dictionary.json', 'w') as file:
    for word in filtered_words:

        # if the word is in the freq_list, then add the frequency to it
        if word in freq_words:
            word_dictionary[word] = word_freq[word]

        # for right now, let's only use the words that were in the freq list
        # the goal eventually is to create 3 separate lists for easy, medium, and hard
        # if not, then just add 1
        #else:
            #word_dictionary[word] = "1"
    
    # write the word list back to the json file
    json.dump(word_dictionary, file, indent=4)
