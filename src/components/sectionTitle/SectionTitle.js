import React from 'react';
import './sectiontitle.scss';

const SectionTitle = (props) => {
  return (
    <div className="headingBox">
        <p className="headingBox--title">{props.title}</p>
    </div>
  )
}

export default SectionTitle
