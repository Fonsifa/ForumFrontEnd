import { currentUser } from "@/services/ant-design-pro/api";
import { deletePost, getMyPosts, getTags, updatePost } from "@/services/forum/forum";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { Button, Card, Drawer, Form, Input, InputNumber, message, PageHeader, Select, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "umi";

const emptyPost:API.Post={
    id: 0,
    content: "-",
    title: "-",
    uid: 0,
    user: undefined,
    time: "-",
}

const options=[];

const getOptions= async()=>{
    const res=await getTags();
    if (res.errCode===0&&res.data.length>0){
        console.log(res.data);
        const tags=res.data;
        tags.forEach(tag=>{
            options.push(<Select.Option key={tag.id}>{tag.theme}</Select.Option>)
        })
    }
    return [];
}

getOptions();

const MyPost:React.FC=()=>{
    const [posts,setPosts]=useState<Array<API.Post>>([]);
    const [showModifier,setShowModifier]=useState(false);
    const [post,setPost]=useState<API.Post>(emptyPost);
    const [selectTags,setSelecteTags]=useState<Array<number>>([]);
    const [tagsId,setTagsId]=useState<Array<string>>([]);
    const [loading,setLoading]=useState(true);
    const intl = useIntl();
    const ref = useRef();

    const getPosts = async()=>{
        try{
            const user = await currentUser();
            const uid = parseInt(user.data.userid===undefined?"0":user.data.userid);
            const res = await getMyPosts(uid);
            if(res.errCode===0){
                setPosts(res.data);
            }
        }catch(error){
            const defaultLoginFailureMessage = intl.formatMessage({
                id: 'API fall',
                defaultMessage: '获取失败，请重试！',
              });
              message.error(defaultLoginFailureMessage);
        }
        setLoading(false);
    }

    useEffect(()=>{
        if(loading){
           getPosts();
        }
    })
    const postColumns: ProColumns<API.Post>[]=[
        {
            title: (
                <FormattedMessage
                  id="Content"
                  defaultMessage="Content"
                />
              ),
              dataIndex: 'content',
              tip: '內容',
              render: (dom, entity) => {
                return (
                <Card
                    hoverable
                    style={{ width: 940 }}
                    //cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                >
                    <Card.Meta 
                        title={entity.title} 
                        description={entity.content.length>100?entity.content.slice(0,100)+"...":entity.content} />
                </Card>
                );
              },
        },
        {
            title: (
                <FormattedMessage
                  id="Created Time"
                  defaultMessage="Created Time"
                />
              ),
              dataIndex: 'time',
              tip: '创建时间',
              render: (dom, entity) => {
                return (
                    <Typography.Text>{dayjs(entity.time).format('YYYY-MM-DD HH:mm')}</Typography.Text>
                );
              },
        },
        {
            title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
              <a
                color="red"
                key="delete"
                onClick={async() => {
                    try{
                        const res = await deletePost(record.id);
                        if (res.errCode===0){
                            const defaultSuccessMessage = intl.formatMessage({
                                id: 'API OK',
                                defaultMessage: '已刪除！',
                              });
                            message.success(defaultSuccessMessage)
                        }else{
                            const defaultLoginFailureMessage = intl.formatMessage({
                                id: 'API fall',
                                defaultMessage: '获取失败，请重试！',
                              });
                              message.error(defaultLoginFailureMessage);
                        }
                    }catch(error){
                        const defaultLoginFailureMessage = intl.formatMessage({
                            id: 'API fall',
                            defaultMessage: '获取失败，请重试！',
                          });
                          message.error(defaultLoginFailureMessage);
                    }
                }}
              >
                <FormattedMessage id="刪除" defaultMessage="刪除" />
              </a>,
               <a
               key="modify"
               onClick={() => {
                   setPost(record);
                   const ids =Array<string>();
                   if(record.tags!==undefined&&record.tags.length>0){
                       record.tags.forEach((tag,_)=>{
                           ids.push(tag.id.toString());
                       })
                   }
                   setTagsId(ids);
                   console.log(ids);
                   setShowModifier(true);
               }}
             >
               <FormattedMessage id="修改" defaultMessage="修改" />
             </a>,
            ],
        }
    ]

    const onFinish=async(post: API.Post)=>{
        const user = await currentUser();
        const payload:API.updatePostParams = {
            id: post.id,
            content: post.content,
            uid: parseInt(user.data.userid===undefined?"0":user.data.userid),
            title: post.title,
            tags: selectTags,
        }
        try{
            const res = await updatePost({...payload});
            if(res.errCode===0){
                setShowModifier(false);
            }
        }catch(error){
            const defaultLoginFailureMessage = intl.formatMessage({
                id: 'API fall',
                defaultMessage: '获取失败，请重试！',
              });
              message.error(defaultLoginFailureMessage);
        }
    }

    const handleChange=(value)=>{
        var tagIds =Array<number>();
        value.forEach((tagId)=>tagIds.push(parseInt(tagId===undefined?"0":tagId)));
        setSelecteTags(tagIds);
    }

    return (
        <div>
        <PageHeader
         ghost={false}
         title="我的发布"
     />
         <ProTable<API.Post, API.PageParams>
             actionRef={ref}
             search={false}
             rowKey="key"
             columns={postColumns}
             dataSource={posts}
         />
           <Drawer title="修改帖子" placement="right" onClose={()=>{setShowModifier(false)}}  visible={showModifier}>
        <Form
         name="basic"
         labelCol={{ span: 8 }}
         wrapperCol={{ span: 16 }}
         initialValues={post}
         onFinish={onFinish}
         autoComplete="off">
        <Form.Item
            label="ID"
            name="id"
            rules={[{ required: true, message: 'Please input Title!' }]}
         >
            <InputNumber controls={false} disabled/>
          </Form.Item>
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: 'Please input Title!' }]}
         >
            <Input.TextArea rows={1} />
          </Form.Item>
          <Form.Item
            label="內容"
            name="content"
            rules={[{ required: true, message: 'Please input Content!' }]}
         >
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item 
            label="标签"
            name="Tags"
          >
          <Select
            mode="multiple"
            placeholder="Please select"
            defaultValue={tagsId}
            onChange={handleChange}
            style={{ width: '100%' }}
            >
            {options}
        </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
         </Form>
      </Drawer>
         </div>
    )
}

export default MyPost;