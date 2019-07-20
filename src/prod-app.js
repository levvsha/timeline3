import './styles.styl';
import drawFunction from './demo';
import * as d3 from 'd3';

d3.json("https://api.jsonbin.io/b/5d2323ecb7cb986712875151/latest").then(function(text) {
  new drawFunction(text);
});

