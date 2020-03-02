
# coding: utf-8

# In[25]:


get_ipython().run_cell_magic('time', '', 'import numpy as np\nimport pandas as pd')


# In[26]:


df = pd.read_csv('Trait_ID_ 37 _table.csv',encoding = 'unicode_escape')


# In[27]:


df.columns


# In[28]:


ds = df[['AccSpeciesName','ObsDataID','OrigValueStr']]


# In[29]:


ds


# In[30]:


ds['OrigValueStr'].unique().tolist()


# In[31]:


dds = ds.groupby('OrigValueStr').count()


# In[32]:


dds


# In[33]:


dds = dds[dds['AccSpeciesName']>100]
dds.sort_values(by = 'AccSpeciesName',ascending = False)


# In[34]:


ds['OrigValueStr'] = ds['OrigValueStr'].replace('evergreen',1)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('deciduous',0)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('E',1)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('D',0)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('EV',1)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('Evergreen',1)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('no',0)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('Deciduous broad-leaved',0)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('Deciduous',0)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('N',0)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('always summer green',0)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('Y',1)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('yes',1)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('always persistent green',1)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('Evergreen broad-leaved',1)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('Nonevergreen',1)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('aestival',0)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('Evergreen needle-leaved',1)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('5',0)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('always overwintering green',1)
ds['OrigValueStr'] = ds['OrigValueStr'].replace('3',0)


# In[35]:


ds = ds.loc[ds['OrigValueStr'].isin([1,0])]


# In[36]:


ds


# In[37]:


ds.to_csv('banchengpin.csv')


# In[38]:


ds = pd.read_csv('banchengpin.csv')


# In[39]:


ds


# In[40]:


for x in range(0,len(ds)):
    st = ds.iloc[x,1]
    st = st.split()
    print(x)
    ds.iloc[x,2] = st[0]
    


# In[41]:


ds = ds.rename(columns = {'ObsDataID':'genus'})


# In[42]:


ds


# In[43]:


ds = ds.groupby('genus').mean()


# In[44]:


ds


# In[45]:


ds.to_csv('dicitonary_leaf_phenology_genus.csv')

