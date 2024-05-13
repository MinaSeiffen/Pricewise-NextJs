import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const navIcons = [
  {src:'/assets/icons/search.svg', alt: 'Search'},
  {src:'/assets/icons/black-heart.svg', alt: 'Heart'},
  {src:'/assets/icons/user.svg', alt: 'User'},
]

const Navbar = () => {
  return (
    <header className='w-full'>
      <nav className='nav'>
        <Link href="/" className='flex justify-center gap-1'>
          <Image src='/assets/icons/logo.svg' alt='logo' width={30} height={30} />
          <p className='nav-logo'>
            Price
            <span className='text-primary'>wise</span>
            </p>
        </Link>
        <div className='items-center flex gap-5'>
          {navIcons.map((icon)=> (
            <Image key={icon.alt} alt={icon.alt} src={icon.src} width={28} height={28} className='object-contain' />
          ))}
        </div>
      </nav>
    </header>
  )
}

export default Navbar