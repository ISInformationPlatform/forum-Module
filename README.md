# forum-Module
InformationPlatform Forum Module

## Database Struct

list data
```json
{
  "post_title" : "somestring",
  "tag" : ["sometag"],
  "author" : "someone",
  "reply_count" : 10,
  "visited" : 10,
  "last_comment" : "someone",
  "last_comment_time" : 1528720726
}
```

detail data
```json
{
  "post_title" : "somestring",
  "tag" : ["sometag"],
  "post_content" : "long string",
  "author" : "someone",
  "reply_count" : 10,
  "visited" : 10
}
```

comment data
```json
{
  "post_id" : "ObjectId2String",
  "comment_author" : "someone",
  "comment_content" : "long string",
  "reply_to_comment_id" : -1
}
```
*reply_to_comment_id means reply to a specific floor, while "-1" means reply to post author*

## Usage

### getAllPost

获取所有帖子

参数
* 板块id

回调函数
* err返回错误信息
* result包含列表数组

### getPostDetail

获取特定帖子的详情

参数
* 板块id
* 帖子id

回调函数
* err返回错误信息
* result包含帖子信息

### submitPost

提交新的帖子

参数
* 板块id
* 帖子信息

回调函数
* err返回错误信息
* result： 0提交失败 1提交成功

### updatePostDetail

更新帖子信息

参数
* 板块id
* 帖子id
* 帖子信息（要求完整）

回调函数
* err返回错误信息
* result： 0修改失败 1修改成功

### toggleVisitIncrease

浏览次数自增

参数
* 板块id
* 帖子id

回调函数
* err返回错误信息
* result：0增加失败 1增加成功

### toggleReplyIncrease

回复次数自增

参数
* 板块id
* 帖子id

回调函数
* err返回错误信息
* result：0增加失败 1增加成功

**注意：在回复帖子时(也就是执行submitComment)会回复数会自动自增，无需再执行该函数**

### getAllComment

获取所有回复

参数
* 板块id
* 帖子id

回调函数
* err返回错误信息
* result：包含所有回复数组

### submitComment

提交新的评论

参数
* 板块id
* 帖子id
* 评论信息

回调函数
* err返回错误信息
* result： 0提交失败 1提交成功

**回复帖子id默认为-1，代表回复楼主**

### updateComment

更新帖子信息

参数
* 板块id
* 帖子id
* 评论id
* 评论信息（要求完整）

回调函数
* err返回错误信息
* result： 0修改失败 1修改成功

## 附前端解析ObjectId函数

后端的_id字段为ObjectId类型，但在发送给前端后会自动转化为String类型

由于ObjectId的唯一性，使用ObjectId比使用自增id字段效率更高也更节省空间，由此决定放弃自增id字段

该函数可从ObjectId获取到Unix时间戳

```js
function getTimestamp(str){
		var bytes = [];
		for (var i = 0; i < 4; i++) {
    		bytes[i] = parseInt(str.substring(i * 2, i * 2 + 2), 16);
		}
		var int = (((bytes[0]) << 24) |
    		((bytes[1] & 0xff) << 16) |
    		((bytes[2] & 0xff) << 8) |
    		((bytes[3] & 0xff)));
		return int;
	}
```
