import { Button, Descriptions, PageHeader } from 'antd'
import Paragraph from 'antd/lib/typography/Paragraph'
import React from 'react'

const Header = () => {
  return (
    <div className='site-page-header'>
      <PageHeader ghost={false} title='react-perspective-cropper'>
        <Descriptions size='small' column={2}>
          <Descriptions.Item label='Package'>
            <a href='https://www.npmjs.com/package/react-perspective-cropper'>
              <img
                alt='npm'
                src='https://img.shields.io/npm/v/react-perspective-cropper.svg'
              />
            </a>
            <a href='https://standardjs.com'>
              <img
                alt='standardjs'
                src='https://img.shields.io/badge/code_style-standard-brightgreen.svg'
              />
            </a>
          </Descriptions.Item>
          <Descriptions.Item label='Description'>
            <Paragraph>
              React component performing border detection, perspective
              correction and simple image filters over a provided image 📲 📸
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label='Created by'>
            Giacomo Cerquone from
            <span
              aria-label='italy flag'
              role='img'
              style={{ margin: '0 10px' }}
            >
              🇮🇹
            </span>
            with{' '}
            <span aria-label='heart' role='img' style={{ margin: '0 10px' }}>
              ❤️
            </span>
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
    </div>
  )
}

export default Header
