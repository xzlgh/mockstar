# 04. 如何做数据模拟

根据不同的目的，数据模拟的方式也会有差别。

## 1. 分析接口结构，动态生成模拟数据

通常情况下，CGI 需要与前端定义好接口，然后提供一份接口说明。该方式是根据接口结构，生成模拟数据，例如：

-  就是这样一个工具，它可以通过分析接口结构，动态生成模拟数据。
- 亦或是按约定的格式生成数据，例如使用 [Mock.js](http://mockjs.com/) 等工具。

## 2. 自定义数据模拟

有时候随机生成的数据并没法很好的满足我们的诉求，因为要构造特殊数据，就可以自定义数据模拟。例如从现有 CGI 接口获得数据之后，只更改其中某一两个字段，从而产生了自己需要的数据。