import React from 'react'
import styles from './postDetail.module.scss'

function postDetail({title, body}) {
  return (
    <div className={styles.post}>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  )
}

export default postDetail
