import { useTranslation } from 'next-i18next'
import { useCallback, useEffect, useRef, useState } from 'react'
import NextLink from 'next/link'
import playVideoCover from '@/img/home/playVideoCover.png'
import { motion, useTransform, useViewportScroll } from 'framer-motion'
import { DiscordIcon } from '@/img/public/discord'
import { GithubIcon } from '@/img/public/github'
import clsx from 'clsx'
import { sendTagEvent } from '@/utils/gtag'

export const Title = (props) => {
  const { githubStarts, setPlayMaskShow, onSubscribe } = props
  const { t } = useTranslation('home')
  const containerRef = useRef(null)
  const [canClick, setCanClcik] = useState(true)

  const { scrollYProgress, scrollY } = useViewportScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.038], [1, 0])
  const titlePositionY = useTransform(scrollYProgress, [0, 0.038], [0, -24])
  const width = useTransform(scrollYProgress, [0, 0.038], [1040, 1200])
  const imgPositionY = useTransform(
    scrollYProgress,
    [0, 0.04],
    ['0vh', '-60vh'],
  )

  useEffect(() => {
    return scrollYProgress.onChange((leatest) => {
      if (leatest >= 0.038) {
        setCanClcik(false)
      } else {
        setCanClcik(true)
      }
    })
  }, [scrollYProgress])

  const mouseenterHandler = useCallback(
    function (e) {
      containerRef.current.style.setProperty('--mouse-x', e.clientX)
      containerRef.current.style.setProperty(
        '--mouse-y',
        e.clientY - 80 + scrollY.current,
      )
    },
    [scrollY],
  )

  const mousemoveHandler = useCallback(
    function (e) {
      containerRef.current.style.setProperty('--mouse-x', e.clientX)
      containerRef.current.style.setProperty(
        '--mouse-y',
        e.clientY - 80 + scrollY.current,
      )
    },
    [scrollY],
  )

  const mouseleaveHandler = useCallback(function (e) {
    containerRef.current.style.setProperty('--mouse-x', -999)
    containerRef.current.style.setProperty('--mouse-y', -999)
  }, [])

  useEffect(() => {
    if (document && CSS && CSS.paintWorklet) {
      CSS.paintWorklet.addModule(
        `data:application/javascript;charset=utf8,${encodeURIComponent(`
  class MagnetMatrixPaintWorklet {
    static get inputProperties() { return ['--mouse-x', '--mouse-y', '--magnet-color', '--magnet-size', '--magnet-gap', '--magnet-radius']; }

    paint(ctx, size, props) {
      const mouseX = parseInt(props.get('--mouse-x'))
      const mouseY = parseInt(props.get('--mouse-y'))
      const color = props.get('--magnet-color')
      const lineWidth = parseInt(props.get('--magnet-size'))
      const gap = parseInt(props.get('--magnet-gap'))
      const radius = parseInt(props.get('--magnet-radius'))
      ctx.lineCap = "round";
      for (let i = 0; i * gap < size.width; i++) {
        for (let j = 0; j * gap < size.height; j++) {
          const posX = i * gap
          const posY = j * gap
          const distance = Math.sqrt(Math.pow(posX - mouseX, 2) + Math.pow(posY - mouseY, 2))
          const width = distance < radius ? (1 - distance / radius * distance / radius) * gap * 0.2 : 0
          const startPosX = posX - width * 0.5
          const endPosX = posX + width * 0.5
          const rotate = Math.atan2(mouseY - posY, mouseX - posX)

          ctx.save()
          ctx.beginPath();
          ctx.translate(posX, posY);
          ctx.rotate(rotate);
          ctx.translate(-posX, -posY);
          ctx.moveTo(startPosX, posY);
          ctx.strokeStyle = color
          ctx.lineWidth = lineWidth;
          ctx.lineCap = "round";
          ctx.lineTo(endPosX, posY);
          ctx.stroke()
          ctx.closePath()
          ctx.restore()
        }
      }
    }
  }

  registerPaint('magnet-matrix', MagnetMatrixPaintWorklet);
`)}`,
      )
    }
  }, [])

  return (
    <div
      className="hidden xl:flex z-30 top-[80px] bg-black text-title grow-0 text-[40px] text-white-01  flex flex-col  items-center font-bold relative overflow-hidden"
      ref={containerRef}
      id="firstPageCover"
      style={{
        height: '100vh',
        '--magnet-color': 'rgb(101, 74, 236)',
        '--magnet-size': '1',
        '--magnet-gap': '32',
        '--magnet-radius': '200',
        background: 'paint(magnet-matrix)',
        backgroundColor: 'black',
      }}
      onMouseEnter={mouseenterHandler}
      onMouseMove={mousemoveHandler}
      onMouseLeave={mouseleaveHandler}
    >
      <motion.div
        style={{ opacity: opacity, translateY: titlePositionY }}
        className={clsx('fixed left-0 top-[20vh] w-full flex justify-center', {
          'pointer-events-none': !canClick,
        })}
      >
        <div className="h-full flex flex-col items-center animate-title-visible w-[1040px]">
          <span className=" px-[20px] sm:px-0  sm:whitespace-pre-line text-center text-[64px] leading-[78px]">
            {t('slogan-1')}
          </span>
          <span className="font-normal text-[20px] mt-[24px] px-[20px] sm:px-0 text-center">
            {t('description')}
          </span>
          <div className="flex items-center content-between gap-[16px] text-[20px] mt-[24px]">
            <NextLink href="https://fast-try.illacloud.com/">
              <button
                className="h-[48px] bg-tech-purple-01 rounded-[8px] px-[64px] py-[8px] text-white-01 hover:bg-tech-purple-02 active:bg-tech-purple-n-01"
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
            <NextLink href="/docs/illa-cli">
              <button
                className="h-[48px] bg-blackAlpha-05 border-[1px] border-white-01 rounded-[8px] px-[64px] py-[8px] text-white-01"
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
          </div>
          <div className="flex mt-[40px] gap-[48px] ">
            <div
              className="flex gap-[16px] cursor-pointer items-center"
              onClick={() => {
                sendTagEvent({
                  action: 'click',
                  category: 'homepage_body_github_click',
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
              <div className="flex flex-col ">
                <span className="text-white-01 text-[16px]">
                  {githubStarts}
                </span>
                <span className="text-white-04 text-[14px] font-normal">
                  {t('stars')}
                </span>
              </div>
            </div>
            <div
              className="flex gap-[16px] cursor-pointer items-center"
              onClick={() => {
                sendTagEvent({
                  action: 'click',
                  category: 'homepage_body_discord_click',
                  label: t('join-community'),
                  value: 'https://discord.gg/zKf3WKCufR',
                })
                window.open('https://discord.gg/zKf3WKCufR', '__blank')
              }}
            >
              <DiscordIcon />
              <div className="flex flex-col">
                <span className="text-white-01 text-[16px]">
                  {t('join-community')}
                </span>
                <span className="text-white-04 text-[14px] font-normal">
                  Discord
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="w-full flex items-center justify-center absolute top-[70vh]"
        style={{
          translateY: imgPositionY,
        }}
      >
        <motion.img
          src={playVideoCover}
          className="animate-coverage-visible  flex items-center justify-center "
          style={{
            width: width,
          }}
          onClick={() => {
            sendTagEvent({
              action: 'click',
              category: 'homepage_body_video_click',
            })
            setPlayMaskShow(true)
          }}
        />
      </motion.div>
    </div>
  )
}
