import {
  useState,
  useEffect,
  createContext,
  Fragment,
  useCallback,
  useContext,
} from 'react'
import { ClassTable } from '@/components/ClassTable'
import { useRouter } from 'next/router'
import { usePrevNext } from '@/hooks/usePrevNext'
import { SidebarContext } from '@/layouts/SidebarLayout'
import { PageHeader } from '@/components/PageHeader'
import clsx from 'clsx'
import { Footer } from '@/components/Footer'
import { Heading } from '@/components/Heading'
import { MDXProvider } from '@mdx-js/react'

export const ContentsContext = createContext()

function TableOfContents({ tableOfContents, currentSection }) {
  let sidebarContext = useContext(SidebarContext)
  let isMainNav = Boolean(sidebarContext)

  function closeNav() {
    if (isMainNav) {
      sidebarContext.setNavIsOpen(false)
    }
  }

  function isActive(section) {
    if (section.slug === currentSection) {
      return true
    }
    if (!section.children) {
      return false
    }
    return section.children.findIndex(isActive) > -1
  }

  let pageHasSubsections = tableOfContents.some(
    (section) => section.children.length > 0,
  )

  return (
    <>
      <h5 className="text-slate-900 font-semibold mb-4 text-sm leading-6 dark:text-slate-100">
        On this page
      </h5>
      <ul className="text-slate-700 text-sm leading-6">
        {tableOfContents.map((section) => (
          <Fragment key={section.slug}>
            <li>
              <a
                href={`#${section.slug}`}
                onClick={closeNav}
                className={clsx(
                  'block py-1',
                  pageHasSubsections ? 'font-medium' : '',
                  isActive(section)
                    ? 'font-medium text-sky-500 dark:text-sky-400'
                    : 'hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300',
                )}
              >
                {section.title}
              </a>
            </li>
            {section.children.map((subsection) => (
              <li className="ml-4" key={subsection.slug}>
                <a
                  href={`#${subsection.slug}`}
                  onClick={closeNav}
                  className={clsx(
                    'group flex items-start py-1',
                    isActive(subsection)
                      ? 'text-sky-500 dark:text-sky-400'
                      : 'hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300',
                  )}
                >
                  <svg
                    width="3"
                    height="24"
                    viewBox="0 -9 3 24"
                    className="mr-2 text-slate-400 overflow-visible group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-500"
                  >
                    <path
                      d="M0 0L3 3L0 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {subsection.title}
                </a>
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
    </>
  )
}

function useTableOfContents(tableOfContents) {
  let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.slug)
  let [headings, setHeadings] = useState([])

  const registerHeading = useCallback((id, top) => {
    setHeadings((headings) => [
      ...headings.filter((h) => id !== h.id),
      { id, top },
    ])
  }, [])

  const unregisterHeading = useCallback((id) => {
    setHeadings((headings) => headings.filter((h) => id !== h.id))
  }, [])

  useEffect(() => {
    if (tableOfContents.length === 0 || headings.length === 0) return
    function onScroll() {
      let style = window.getComputedStyle(document.documentElement)
      let scrollMt = parseFloat(
        style.getPropertyValue('--scroll-mt').match(/[\d.]+/)?.[0] ?? 0,
      )
      let fontSize = parseFloat(style.fontSize.match(/[\d.]+/)?.[0] ?? 16)
      scrollMt = scrollMt * fontSize

      let sortedHeadings = headings.concat([]).sort((a, b) => a.top - b.top)
      let top = window.pageYOffset + scrollMt + 1
      let current = sortedHeadings[0].id
      for (let i = 0; i < sortedHeadings.length; i++) {
        if (top >= sortedHeadings[i].top) {
          current = sortedHeadings[i].id
        }
      }
      setCurrentSection(current)
    }
    window.addEventListener('scroll', onScroll, {
      capture: true,
      passive: true,
    })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll, {
        capture: true,
        passive: true,
      })
    }
  }, [headings, tableOfContents])

  return { currentSection, registerHeading, unregisterHeading }
}

export function ContentsLayout({
  children,
  meta,
  classes,
  tableOfContents,
  section,
}) {
  const router = useRouter()
  const toc = [
    ...(classes
      ? [{ title: 'Quick reference', slug: 'class-reference', children: [] }]
      : []),
    ...tableOfContents,
  ]

  const { currentSection, registerHeading, unregisterHeading } =
    useTableOfContents(toc)
  let { prev, next } = usePrevNext()

  return (
    <div className="max-w-3xl mx-auto pt-10 xl:max-w-none xl:ml-0 xl:mr-[15.5rem] xl:pr-16">
      <PageHeader
        title={meta.title}
        description={meta.description}
        repo={meta.repo}
        badge={{ key: 'ILLA version', value: meta.featureVersion }}
        section={section}
        crowdinRepo={meta.crowdinRepo}
        categoryName={meta.categoryName}
      />
      <ContentsContext.Provider value={{ registerHeading, unregisterHeading }}>
        {classes ? (
          <>
            <ClassTable {...classes} />
            <div
              id="content-wrapper"
              className="relative z-20 prose prose-slate mt-12 dark:prose-dark"
            >
              <MDXProvider components={{ Heading }}>{children}</MDXProvider>
            </div>
          </>
        ) : (
          <div
            id="content-wrapper"
            className="relative z-20 prose prose-slate mt-8 dark:prose-dark"
          >
            <MDXProvider components={{ Heading }}>{children}</MDXProvider>
          </div>
        )}
      </ContentsContext.Provider>

      <Footer previous={prev} next={next} />

      <div className="fixed z-20 top-[3.8125rem] bottom-0 right-[max(0px,calc(50%-45rem))] w-[19.5rem] py-10 px-8 overflow-y-auto hidden xl:block">
        {toc.length > 0 && (
          <TableOfContents
            tableOfContents={toc}
            currentSection={currentSection}
          />
        )}
      </div>
    </div>
  )
}
