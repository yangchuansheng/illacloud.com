import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import playVideoCover from '@/img/home/playVideoCover.png'
import * as ReactDOM from 'react-dom'
import { Player } from '@/components/home/player'
import { GithubIcon } from '@/img/public/github'
import { DiscordIcon } from '@/img/public/discord'
import { sendTagEvent } from '@/utils/gtag'

export const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 w-full z-50">
      <Player menuExpand closeMenu={onClose} />
    </div>,
    document.body,
  )
}

export const MobileTitle = (props) => {
  const { t } = useTranslation('home')
  const [menuExpand, setMenuExpand] = useState(false)
  const { setPlayMaskShow, githubStarts, onSubscribe } = props

  useEffect(() => {
    document.body.style.overflow = menuExpand ? 'hidden' : 'auto'
  }, [menuExpand])
  return (
    <div className="w-full xl:hidden	">
      <div className="px-[20px] h-full flex flex-col items-center justify-center w-full">
        <div className="text-white-01 text-[40px] text-center font-bold pt-[20px] leading-[48px]">
          {t('slogan-1')}
        </div>
        <div className="mt-[32px] text-white-01 text-[14px] text-center">
          {t('description')}
        </div>
        <div className="mt-[32px] w-full flex gap-[16px]">
          <NextLink href="/docs/illa-cli">
            <button
              className="w-full border-white border-[1px] py-[12px] px-[16px] rounded-[8px] text-white-01 text-[16px]"
              onClick={() => {
                sendTagEvent({
                  action: 'click',
                  category: 'homepage_body_self_hosted_click',
                  label: t('self-Hosted'),
                })
              }}
            >
              {t('self-Hosted')}
            </button>
          </NextLink>
          <NextLink href="https://fast-try.illacloud.com/">
            <button
              className="w-full bg-tech-purple-01 py-[12px] px-[16px] rounded-[8px] text-white-01 text-[16px]"
              onClick={() => {
                sendTagEvent({
                  action: 'click',
                  category: 'homepage_body_live_demo_click',
                  label: t('illa-Cloud'),
                  value: 'https://fast-try.illacloud.com/',
                })
              }}
            >
              {t('illa-Cloud')}
            </button>
          </NextLink>
        </div>
        <div className="flex items-center mt-[32px] gap-[40px]">
          <div
            className="flex items-center gap-[8px]"
            onClick={() => {
              sendTagEvent({
                action: 'click',
                category: 'homepage_body_github_mob_click',
                label: `${githubStarts} ${t('stars')}`,
                value: 'https://github.com/illacloud/illa-builder',
              })
              window.open(
                'https://github.com/illacloud/illa-builder',
                '__blank',
              )
            }}
          >
            <GithubIcon />
            <span className="text-white-01 text-[13px]">
              {githubStarts} {t('stars')}
            </span>
          </div>
          <div
            className="flex items-center gap-[8px]"
            onClick={() => {
              sendTagEvent({
                action: 'click',
                category: 'homepage_body_discord_mob_click',
                label: t('join-community'),
                value: 'https://discord.gg/zKf3WKCufR',
              })
              window.open('https://discord.gg/zKf3WKCufR', '__blank')
            }}
          >
            <DiscordIcon />
            <span className="text-white-01 text-[13px]">
              {t('join-community')}
            </span>
          </div>
        </div>
        <div
          className="mt-[32px] relative"
          onClick={() => {
            sendTagEvent({
              action: 'click',
              category: 'homepage_body_video_click',
            })
            setPlayMaskShow(true)
          }}
        >
          <Image
            src={playVideoCover}
            width="2080"
            height="1294"
            alt="play video"
          />
        </div>
      </div>
    </div>
  )
}
