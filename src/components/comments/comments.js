import React from 'react';
import styles from './comments.module.scss';

function comments({name, email, body}) {
  return (
    <div className={styles.comments}>
      <h4>{name}</h4>
      <p>{email}</p>
      <p>{body}</p>
    </div>
  )
}

export default comments
