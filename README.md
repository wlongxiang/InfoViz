# InfoViz
Assignment for Information Visualization course at University of Amsterdam 2020.

# Datasets
- https://www.kaggle.com/lucabasa/dutch-energy
  -> electricity and gas info on zipcode level
  -> contains data from 2010 till 2019
- https://zakelijk.kadaster.nl/open-datasets-kadaster
  -> on addresses and buildings
  -> adress, year, area, function, location, identification nr
- https://www.cbs.nl/nl-nl/maatwerk/2018/49/bevolking-en-huishoudens-4-cijferige-postcode-1-1-2018
  -> population density and household data in 2018
  -> nr of people per postal code (letters not included)
- https://www.cbs.nl/nl-nl/nieuws/2019/12/regionale-verschillen-in-huizenprijzen-groter
  -> average housing prices in 2018 per 'gemeente'
- https://www.arcgis.com/home/item.html?id=68d84ef791594f329dc4b557645090a9#overview
  -> dataset of public transport stops and stations

# Meeting notes
## Week 3 @ 20/02/2020
What's discussed:
- Showed the sketch of our visualisation idea

Feedback:
- It's not required to use bokeh or d3 as long as it serves the purpose
- Start with the basics: show a map with electricity data and basic filter
- Target users are house hunters or real estate investors
- Think from user perspective and focus a bit on user experience
- Polish up esthetics at later stage
- Think of more advanced filters like generating recommendations based on combination of priorities. For example, we can base our recommendations on questions like "how much do you value energy efficiency", "what is your price range?" 

Action points:
- setup basic backend with electricity data
- start with basic front end with mapping data
