import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv("/content/data.csv")
df.head()

x = ['CND' , 'DWM' , 'WC' ,'AI' , 'STATS']
data = df.iloc[0:1]
print(type(data))
print(data)
unit_1 = data.iloc[0,3:8]
unit_2 = data.iloc[0,8:13]
# print(unit_1)
# print(unit_2)
unit_1 = np.asarray(unit_1)
unit_2 = np.asarray(unit_2)
# print(unit_1)
x_axis = np.arange(len(x))

plt.bar(x_axis - 0.2, unit_1, 0.4, label = 'UNIT-1')
plt.bar(x_axis + 0.2, unit_2, 0.4, label = 'UNIT-2')
  
plt.xticks(x_axis, x)
plt.xlabel("Subjects")
plt.ylabel("Marks")
plt.title("Performance")
plt.legend()
plt.show()

print(dataToSendBack)
sys.stdout.flush()