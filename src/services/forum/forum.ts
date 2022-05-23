// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**get 标签 */
export async function getTags( options?: { [key: string]: any }) {
  return request<API.Response<Array<API.Tag>>>('/api/getTags', {
    method: 'GET',
    ...(options || {}),
  });
}

/**get 帖子 */
export async function getPosts(tagId: number, options?: { [key: string]: any }) {
    return request<API.Response<Array<API.Post>>>('/api/getPosts?id='+tagId, {
      method: 'GET',
      ...(options || {}),
    });
  }

  export async function getMyPosts(uid: number, options?: { [key: string]: any }) {
    return request<API.Response<Array<API.Post>>>('/api/getMyPosts?id='+uid, {
      method: 'GET',
      ...(options || {}),
    });
  }

/**get Comments */
export async function getComments(postId: number, options?: { [key: string]: any }) {
    return request<API.Response<Array<API.Comment>>>('/api/getComments?id='+postId, {
      method: 'GET',
      ...(options || {}),
    });
  }

  export async function addComment(options?: { [key: string]: any }) {
      return(request<API.Response<boolean>>('/api/putComment', {  
        method: 'POST',
        data: (options),
      }));
  }

  export async function addPost(options?: { [key: string]: any }) {
    return(request<API.Response<API.Post>>('/api/post', {  
      method: 'POST',
      data: (options),
    }));
}

export async function updatePost(options?: { [key: string]: any }) {
    return(request<API.Response<API.Post>>('/api/updatePost', {  
      method: 'POST',
      data: (options),
    }));
}

/**delete post*/
export async function deletePost(postId: number, options?: { [key: string]: any }) {
    return request<API.Response<Boolean>>('/api/delPost?id='+postId, {
      method: 'DELETE',
      ...(options || {}),
    });
  }
