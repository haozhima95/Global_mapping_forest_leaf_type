# Codes of addtional analyses to validate the modelling robustness. 

### This folder contains scripts that use WOSIS point-level observations to evaluate the robustness of our mapping approaches. 

- **To obtain a plot-level dataset containing WOSIS soil characteristics**, run the file named "[Silt_match.Rmd](mapping_code/Validation_code/Silt_match.Rmd)" and "[fftmatch_wosis.Rmd](mapping_code/Validation_code/fftmatch_wosis.Rmd)".
- **After running the script "[sample_wosis.Rmd](mapping_code/Validation_code/sample_wosis.Rmd)"**, scripts "[leaf_type_pred_soil_grids.js](mapping_code/Validation_code/leaf_type_pred_soil_grids.js)" and "[leaf_type_pred_wosis.js](mapping_code/Validation_code/leaf_type_pred_wosis.js)" can be run in Google Earth Engine to get predictions based on Soil Grids and WOSIS respectively. 
- **To compare both predictions**, run the script named "[wosis_soil_grids_compare.Rmd](mapping_code/Validation_code/wosis_soil_grids_compare.Rmd)".

- **To convert ESA CCI LC layers to leaf type proportion layers**, run the script named "[esa_classify.js](mapping_code/Validation_code/esa_classify.js)" in Google Earth Engine. 
- **To compaer the performance of ESA CCI LC layers with RF model layers**, run the script named "[ESA_compare.Rmd](mapping_code/Validation_code/ESA_compare.Rmd)" in R Markdown.
