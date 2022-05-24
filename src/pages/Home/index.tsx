import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Drawer, Form, Input, message, PageHeader, Select, Space, Typography} from 'antd';
import { addPost, getPosts, getTags } from '@/services/forum/forum';
import { FormattedMessage, useIntl } from 'umi';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import PostDetail from '@/components/PostDetail';
import dayjs from 'dayjs';
import { currentUser } from '@/services/ant-design-pro/api';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';

const emptyPost:API.Post={
    id: 0,
    content: "-",
    title: "-",
    uid: 0,
    user: undefined,
    time: "-",
}

const pics = [
"https://img1.baidu.com/it/u=3523935618,2283806271&fm=253&fmt=auto&app=138&f=JPEG?w=407&h=273",
"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fres0.dyhjw.com%2Fupload%2Fadmin%2F20200621%2F213674ccde2a99beb8c9bc230f800b12.png&refer=http%3A%2F%2Fres0.dyhjw.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655555941&t=0455a74ec0cb6391daff0904811a99bf",
"https://img0.baidu.com/it/u=3187615276,3111286161&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fstock.gucheng.com%2FUploadFiles_7844%2F202006%2F2020061915220952.jpg&refer=http%3A%2F%2Fstock.gucheng.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655556060&t=c9ec2eff96a611658f6471538a56b2d7"]

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

const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );
const Home: React.FC = () => {
    const [isDetail,setIsDetail]=useState(false);
    const [isPost,setIsPost]=useState(false);
    const [post,setPost]=useState<API.Post>();
    const [posts,setPosts]=useState<Array<API.Post>>([]);
    const [showAddPost,setShowAddPost]=useState(false);
    const [selectTags,setSelecteTags]=useState<Array<number>>([]);
    const [loading,setLoading]=useState(true);
    const [tagId,setTagId]=useState(0);
    const intl = useIntl();
    const ref = useRef();

    useEffect(()=>{
      if(loading){
        getPost();
      }
    });
    const getPost = async()=>{
      try{
          const res = await getPosts(tagId);
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

    const columns: ProColumns<API.Tag>[]=[
        {
            title: (
                <FormattedMessage
                  id="Tag Theme"
                  defaultMessage="Tag Theme"
                />
              ),
              dataIndex: 'theme',
              tip: '主題內容',
              render: (dom, entity) => {
                return (
                    <Card
                    hoverable
                    style={{ width: 200 }}
                    cover={<img alt="example" src={pics[entity.id-1]}/>}
                    >
                    <Card.Meta 
                        title={entity.theme} 
                        description={entity.theme.length>100?entity.theme.slice(0,100)+"...":entity.theme} />
                </Card>
                );
              },
        },
        {
            title: (
                <FormattedMessage
                  id="Tag Theme"
                  defaultMessage="最新帖子"
                />
              ),
              dataIndex: 'theme',
              tip: '主題內容',
              render: (dom, entity) => {
                const postNew = entity.posts!==undefined&&entity.posts.length>0?entity.posts[entity.posts.length-1]:emptyPost;
                return (
                <Card
                    hoverable
                    style={{ width: 540 }} >
                    <Card.Meta 
                        title={postNew.title} 
                        description={postNew.content.length>100?postNew.content.slice(0,100)+"...":postNew.content} />
                </Card>
                );
              },
        
        },
        {
            title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
              <Button
                key="config"
                type="primary"
                onClick={async () => {
                    try{
                        const newPosts=await getPosts(record.id);
                        setTagId(record.id);
                        setPosts(newPosts.data);
                        setIsDetail(true);
                    }catch(error){
                        const defaultLoginFailureMessage = intl.formatMessage({
                            id: 'API fall',
                            defaultMessage: '获取失败，请重试！',
                          });
                          message.error(defaultLoginFailureMessage);
                    }
                }}
              >
                <FormattedMessage id="More" defaultMessage="Enter" />
              </Button>,
            ],
        }
    ]

    const postColumns: ProColumns<API.Post>[]=[
        // {
        //     title: (
        //         <FormattedMessage
        //           id="Post Id"
        //           defaultMessage="Post Id"
        //         />
        //       ),
        //       dataIndex: 'id',
        //       tip: '帖子的主題',
        //       render: (dom, entity) => {
        //         return (
        //             <Typography.Text>{dom}</Typography.Text>
        //         );
        //       },
        // },
        // {
        //     title: (
        //         <FormattedMessage
        //           id="Author Id"
        //           defaultMessage="Author Id"
        //         />
        //       ),
        //       dataIndex: 'uid',
        //       tip: '作者Id',
        //       render: (dom, entity) => {
        //         return (
        //             <Typography.Text>{dom}</Typography.Text>
        //         );
        //       },
        // },
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
                    actions={[
                        <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                        <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                        <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                      ]}
                    >
                    <Card.Meta 
                        title={entity.title+"  "+dayjs(entity.time).format('YYYY-MM-DD HH:mm')} 
                        description={entity.content.length>100?entity.content.slice(0,100)+"...":entity.content} />
                </Card>
                );
              },
        },
        {
            title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
              <a
                key="config"
                onClick={() => {
                    setPost(record);
                    setIsPost(true);
                }}
              >
                <FormattedMessage id="More" defaultMessage="詳情" />
              </a>,
            ],
        }
    ]

    const onFinish=async(post: API.Post)=>{
        const user=await currentUser();
        const payload:API.addPostParams = {
            content: post.content,
            uid: parseInt(user.data.userid===undefined?"0":user.data.userid),
            title: post.title,
            tags: selectTags,
        }
        try{
            const res= await addPost({...payload});
            if (res.errCode===0){
                setShowAddPost(false);
                setLoading(true);
            }
        }catch(error){
            const defaultLoginFailureMessage = intl.formatMessage({
                id: 'API fall',
                defaultMessage: '获取失败，请重试！',
              });
              message.error(defaultLoginFailureMessage);
        }
    }
    function handleChange(value:Array<string>) {
        var tagIds =[];
        value.forEach((tagId)=>tagIds.push(parseInt(tagId===undefined?"0":tagId)));
        setSelecteTags(tagIds);
    }

    return (
        <div>
        {!isPost?
            <PageContainer >
            {!isDetail?
            <ProTable<API.Tag, API.PageParams>
              headerTitle={intl.formatMessage({
              id: 'pages.searchTable.title',
              defaultMessage: 'Enquiry form',
            })}
            rowKey="key"
            search={{
              labelWidth: 120,
            }}
            columns={columns}
            request={getTags}
          />:
          <div>
           <PageHeader
            ghost={false}
            onBack={() => setIsDetail(false)}
            title="相关帖子"
            extra={[
                <Button type="primary" onClick={()=>setShowAddPost(true)}>{"新建帖子"}</Button>
            ]}
        />
            <ProTable<API.Post, API.PageParams>
                actionRef={ref}
                search={false}
                rowKey="key"
                columns={postColumns}
                dataSource={posts}
            />
        <Drawer title="新增帖子" placement="right" onClose={()=>{setShowAddPost(false)}}  visible={showAddPost}>
        <Form
         name="basic"
         labelCol={{ span: 8 }}
         wrapperCol={{ span: 16 }}
         onFinish={onFinish}
         autoComplete="off">
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
            defaultValue={[]}
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
          }
        </PageContainer>:
        <PostDetail post={post===undefined?emptyPost:post} setIsPost={setIsPost}/>
        }
        </div>
    )
}

export default Home;