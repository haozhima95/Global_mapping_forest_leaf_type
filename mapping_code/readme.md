# Codes for mapping and forest type change calculation in Google Earth Engine. 

### This folder contains files that generate maps and serveral global statistics. All the files are run in [Google Earth Engine](https://earthengine.google.com/). 

#### Below are the files constructing _Fig.2_ in the manuscript. 

- **To construct training datasets for RF models**, run the file named "[occurrence_sampling_4class.js](mapping_code/occurrence_sampling_4class.js)".

- **To map the present forest leaf type distribution**, run the file named "[fft_probability_dbh_mapping_RF.js](mapping_code/fft_probability_dbh_mapping_RF.js)".

- **To summarize the maps using the abovementioned code**, run the file named "[fft_mapping_summary_RF.js](mapping_code/fft_mapping_summary_RF.js)".

#### Below are the files predicting future climate change envelopes and global statistics. 

- **To predict future forest leaf type distribution due to climate change**, run the file named "[fft_fut_mapping.js](mapping_code/fft_fut_mapping.js)". 
