import matplotlib.pyplot as plt

categories = ["Cat1", "Cat2", "Cat3", "Cat4", "Cat5"]
values = [10, 20, 30, 40, 90]
plt.bar(categories, values)
plt.title("Bar chart example")
plt.xlabel("Categories")
plt.ylabel("Values")
plt.show()
