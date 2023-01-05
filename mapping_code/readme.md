# Codes for mapping and forest type change calculation in Google Earth Engine. 

### This folder contains files that generate maps and serveral global statistics. All the files are run in [Google Earth Engine](https://earthengine.google.com/). 

#### Below are the files constructing _Fig.2_ in the manuscript. 

- **To construct training datasets for RF models**, run the file named "[occurrence_sampling_4class.js](mapping_code/occurrence_sampling_4class.js)".

- **To map the present forest leaf type distribution**, run the file named "[fft_probability_dbh_mapping_RF.js](mapping_code/fft_probability_dbh_mapping_RF.js)".

- **To summarize the maps using the abovementioned code**, run the file named "[fft_mapping_summary_RF.js](mapping_code/fft_mapping_summary_RF.js)".

#### Below are the files predicting future climate change envelopes and global statistics. 

- **To predict future forest leaf type distribution due to climate change**, run the file named "[fft_fut_mapping.js](mapping_code/fft_fut_mapping.js)". 

- **To summarize the maps predicted by different CMIP6 models**, run the files named "[fft_fut_clim_summary.js](mapping_code/fft_fut_clim_summary.js)" and "[fut_fft_summary_allmodel.js](mapping_code/fut_fft_summary_allmodel.js)". 

#### Below are the files that present the global map of forest leaf type changes, shown in _Fig.5_. 

- **To map the global leaf type change**, run the file named "[fft_fut_decrease_most_occurrence.js](mapping_code/fft_fut_decrease_most_occurrence.js)".

- **To map the global change of the degree of evergreen**, run the file named "[eve_diff_fut_now.js](mapping_code/eve_diff_fut_now.js)".

- **To map the global change of the degree of broadleaved**, run the file named "[broad_diff_fut_now.js](mapping_code/eve_diff_fut_now.js)".

#### Below are the files that present global distribution of forest type and future forest type changes, shown in _Fig.S9, S10 & S11_.

- **To map the global distribution of forest type and map forest type change**, run the file named "[forest_type_change.js](mapping_code/forest_type_change.js)". 

#### Below are the files that map global forest leaf type distribution using different models, also shown in _Fig.S12_.

- To map the forest leaf type distribution using CART model, run the file named "[fft_probability_mapping_cart.js](mapping_code/fft_probability_mapping_cart.js)".

- To map the forest leaf type distribution using GTB model, run the file named "[fft_probability_mapping_GTB.js](mapping_code/fft_probability_mapping_GTB.js)"
