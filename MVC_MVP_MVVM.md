[TOC]



# MVC

MVC模式的意思是，软件可以分成三个部分。

![img](.\pics\bg2015020104.png)

> - 视图（View）：用户界面。
> - 控制器（Controller）：业务逻辑
> - 模型（Model）：数据保存

各部分之间的通信方式如下。

![img](.\pics\bg2015020105.png)

> 1. View 传送指令到 Controller
> 2. Controller 完成业务逻辑后，要求 Model 改变状态
> 3. Model 将新的数据发送到 View，用户得到反馈

所有通信都是单向的。

* 接受用户指令时，MVC 可以分成两种方式。一种是通过 View 接受指令，传递给 Controller。

![img](.\pics\bg2015020106.png)

* 另一种是直接通过controller接受指令。

![img](.\pics\bg2015020107.png)

# MVP

MVP 模式将 Controller 改名为 Presenter，同时改变了通信方向。

![img](.\pics\bg2015020109.png)

1. 各部分之间的通信，都是双向的。

2. View 与 Model 不发生联系，都通过 Presenter 传递。

3. View 非常薄，不部署任何业务逻辑，称为"被动视图"（Passive View），即没有任何主动性，而 Presenter非常厚，所有逻辑都部署在那里。



# MVVM

MVVM 模式将 Presenter 改名为 ViewModel，基本上与 MVP 模式一致。

![img](.\pics\bg2015020110.png)

唯一的区别是，它采用双向绑定（data-binding）：View的变动，自动反映在 ViewModel，反之亦然。



> ViewModel需要实现一套数据响应式机制，自动响应Model中数据变化，同时Viewmodel需要实现一套更新策略自动将数据变化转换为视图更新；此外，VM还要通过事件监听响应View中用户交互修改Model中数据。这样在ViewModel中就减少了大量DOM操作代码，就像我们写Vue的时候如果没有特别需求，一般不用写原生的addEventListener。
>
> MVVM在保持View和Model松耦合的同时，还减少了维护它们关系的代码，使用户专注于业务逻辑，兼
>
> 顾开发效率和可维护性。

# 资料参考

[MVC，MVP 和 MVVM 的图示 - 阮一峰的网络日志 (ruanyifeng.com)](https://www.ruanyifeng.com/blog/2015/02/mvcmvp_mvvm.html)





