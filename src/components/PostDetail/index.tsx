import { currentUser } from "@/services/ant-design-pro/api";
import { addComment, getComments } from "@/services/forum/forum";
import { Badge, Card, Typography,Comment, List, Tooltip, message, Button, Form, Drawer, Input, PageHeader} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { useIntl } from "umi";

type PostDetailProps = {
    post: API.Post
    setIsPost: (isPost: boolean)=>void
}

const PostDetail: React.FC<PostDetailProps> = (props) => {
    const {post,setIsPost}=props;
    const[loading, setLoading]=useState(true);
    const [showModal,setShowModal]=useState(false);
    const intl = useIntl();
    const [comments,setComments]=useState<Array<API.Comment>>([]);
    const getComment = async ()=>{
        try{
            const res = await getComments(post.id);
            setComments(res.data);
            setLoading(false);
        }catch(error){
            const defaultLoginFailureMessage = intl.formatMessage({
                id: 'API fall',
                defaultMessage: '获取失败，请重试！',
              });
              message.error(defaultLoginFailureMessage);
        }
    }
    useEffect(()=>{
        if(loading){
            getComment();
        }
    })

    const getData=()=>{
        
        return comments.map((value,_)=>{
            return  (
                {
                actions: [<span key="comment-list-reply-to-0">Reply to</span>],
                author: value.user.nickName+"("+value.user.userName+")",
                avatar: 'https://joeschmoe.io/api/v1/random',
                content: (
                  <p>
                   {value.content}
                  </p>
                ),
                datetime: (
                  <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{dayjs(value.time).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </Tooltip>
                )}
            )
        })
    }

    const onFinish =async (value:API.Comment)=>{
        const user=await currentUser();
        const payload:API.addCommentParams = {
            content: value.content,
            uid: parseInt(user.data.userid===undefined?"0":user.data.userid),
            pid: post.id,
        }
        console.log({...payload})
        try{
            const res= await addComment({...payload});
            if (res.errCode===0){
                setLoading(true);
                setShowModal(false);
            }
        }catch(error){
            const defaultLoginFailureMessage = intl.formatMessage({
                id: 'API fall',
                defaultMessage: '获取失败，请重试！',
              });
              message.error(defaultLoginFailureMessage);
        }

    }

    return (
        <div>
        <Typography>
        <PageHeader
            ghost={false}
            onBack={() => setIsPost(false)}
            title={post.title}
        />
            <Badge.Ribbon text="原創" color="pink">
                <Card title={post.user?.nickName+"("+post.user?.userName+ ") 发布于："+dayjs(post.time).format('YYYY-MM-DD HH:mm')} size="small">
                    <Typography.Text>{post.content}</Typography.Text>
                </Card>
            </Badge.Ribbon>
        </Typography>
        <List
        className="comment-list"
        header={<Button type='primary' onClick={()=>{setShowModal(true)}}>Comment</Button>}
        itemLayout="horizontal"
        dataSource={getData()}
        renderItem={item => (
          <li>
            <Comment
              actions={item.actions}
              author={item.author}
              avatar={item.avatar}
              content={item.content}
              datetime={item.datetime}
            />
          </li>
        )}
      />
      <Drawer title="新增评论" placement="right" onClose={()=>{setShowModal(false)}}  visible={showModal}>
        <Form
         name="basic"
         labelCol={{ span: 8 }}
         wrapperCol={{ span: 16 }}
         onFinish={onFinish}
         autoComplete="off">
          <Form.Item
            label="內容"
            name="content"
            rules={[{ required: true, message: 'Please input content!' }]}
         >
            <Input.TextArea rows={4} />
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

export default PostDetail;