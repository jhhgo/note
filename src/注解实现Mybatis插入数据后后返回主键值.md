# @Options
## 属性
1. useGeneratedKeys：是否使用生成的主键值，(true/false)
2. keyProperty：对象中的成员变量
3. keyColumn：数据库的列名
## 使用
```java
@Insert("insert into t_type (name) values(#{name})")
@Options(useGeneratedKeys = true, keyProperty = "id")
void saveType(Type type);
```
如果数据库中的主键的列名就是id，那么keyColumn属性可以不写。注意这里不是使用saveType()方法的返回值来获取主键值的，如果将saveType()方法的返回值改为Integer，那么返回值只会返回1/0，表示插入是否成功。如果想要获取插入的数据的主键值，调用type.id即可
# @SelectKey
## 属性
1. statement: 要执行的sql语句
2. before: 表示statement中的语句是否要在insert语句执行之前执行
3. keyProperty:将statement语句的返回值赋给哪个对象
4. resultType: statement语句的返回值类型的字节码
## 使用
```java
    @Insert("insert into t_type (name) values(#{name})")
    @SelectKey(statement = "select last_insert_id()", keyProperty = "id", before = false, resultType = long.class)
    void saveType(Type type);
```