"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { HomeIcon, BuildingOfficeIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Facebook, Twitter, Linkedin, Instagram, MapIcon } from "lucide-react";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { PhoneIcon, MapPinIcon } from "@heroicons/react/24/solid";

import { Swiper, SwiperSlide } from "swiper/react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <motion.nav 
        className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link href="/" className="text-2xl font-bold text-blue-600">Real Estate Hub</Link>
        <div className="space-x-6 hidden md:flex">
          <Link href="#about" className="text-gray-700 hover:text-blue-600">About</Link>
          <Link href="#work" className="text-gray-700 hover:text-blue-600">Work Showcase</Link>
          <Link href="#pricing" className="text-gray-700 hover:text-blue-600">Pricing</Link>
          <Link href="#projects" className="text-gray-700 hover:text-blue-600">Projects</Link>
          <Link href="#partners" className="text-gray-700 hover:text-blue-600">Partners</Link>
          <Link href="#contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
        </div>
        <Button asChild>
          <Link href="/auth/login">Get Started</Link>
        </Button>
      </motion.nav>

      {/* Hero Section with Animated Text */}
      <header className="relative flex items-center justify-center bg-cover bg-center text-white m-4"
        style={{ backgroundImage: "url('/real-estate-bg.jpg')" }}>
        <motion.div 
          className="text-center bg-black bg-opacity-50 p-8 rounded-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-bold">Find Your Dream Home</h1>
          <p className="text-xl mt-3">Buy or rent the best properties hassle-free</p>
          <Button className="mt-6">
            <Link href="/properties">View Listings</Link>
          </Button>
        </motion.div>
      </header>

      {/* What We Do Section with Icons */}
      <section id="about" className="max-w-6xl mx-auto mt-20 p-6">
        <h2 className="text-4xl font-bold text-gray-900 text-center">What We Do</h2>
        <Separator className="my-6 mx-auto w-1/6" />
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader className="flex items-center space-x-3">
                <HomeIcon className="h-6 w-6 text-blue-600" />
                <CardTitle>Property Buying</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Helping you find the best property deals.</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader className="flex items-center space-x-3">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                <CardTitle>Renting Made Easy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Connecting tenants with verified landlords.</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader className="flex items-center space-x-3">
                <GlobeAltIcon className="h-6 w-6 text-blue-600" />
                <CardTitle>Investment Consulting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Expert advice for real estate investments.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>



    <div className="min-h-screen bg-gray-100">
      {/* Work Showcase with Improved Carousel */}
      <section id="work" className="max-w-6xl mx-auto mt-20 p-6">
        <h2 className="text-4xl font-bold text-gray-900 text-center">Work Showcase</h2>
        <Separator className="my-6 mx-auto w-1/6" />
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="rounded-lg"
        >
          <SwiperSlide>
            <Card>
              <CardContent>
                <img src="/work1.jpg" alt="Work 1" className="rounded-lg w-full h-60 object-cover" />
              </CardContent>
            </Card>
          </SwiperSlide>
          <SwiperSlide>
            <Card>
              <CardContent>
                <img src="/work2.jpg" alt="Work 2" className="rounded-lg w-full h-60 object-cover" />
              </CardContent>
            </Card>
          </SwiperSlide>
          <SwiperSlide>
            <Card>
              <CardContent>
                <img src="/work3.jpg" alt="Work 3" className="rounded-lg w-full h-60 object-cover" />
              </CardContent>
            </Card>
          </SwiperSlide>
          <SwiperSlide>
            <Card>
              <CardContent>
                <img src="/work4.jpg" alt="Work 4" className="rounded-lg w-full h-60 object-cover" />
              </CardContent>
            </Card>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Our Trusted Partners with Animation */}
      <section id="partners" className="max-w-6xl mx-auto mt-20 p-6">
        <h2 className="text-4xl font-bold text-gray-900 text-center">Our Trusted Partners</h2>
        <Separator className="my-6 mx-auto w-1/6" />
        <motion.div 
          className="flex justify-center space-x-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src="/partner1.png" alt="Partner 1" className="h-16 grayscale hover:grayscale-0 transition-all duration-300" />
          <img src="/partner2.png" alt="Partner 2" className="h-16 grayscale hover:grayscale-0 transition-all duration-300" />
          <img src="/partner3.png" alt="Partner 3" className="h-16 grayscale hover:grayscale-0 transition-all duration-300" />
        </motion.div>
      </section>
    </div>
    <section id="pricing" className="max-w-6xl mx-auto mt-20 p-6">
        <h2 className="text-4xl font-bold text-gray-900 text-center">Our Packages</h2>
        <Separator className="my-6 mx-auto w-1/6" />
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic</CardTitle>
              <Badge className="mt-2">$99 / month</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">✔ Standard property listing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Premium</CardTitle>
              <Badge className="mt-2">$199 / month</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">✔ Featured listing & more exposure</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <Badge className="mt-2">$299 / month</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">✔ Personalized real estate consulting</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Trusted Partners */}
      <section id="partners" className="max-w-6xl mx-auto mt-20 p-6">
        <h2 className="text-4xl font-bold text-gray-900 text-center">Our Trusted Partners</h2>
        <Separator className="my-6 mx-auto w-1/6" />
        <div className="flex justify-center space-x-8">
          <img src="/partner1.png" alt="Partner 1" className="h-16" />
          <img src="/partner2.png" alt="Partner 2" className="h-16" />
          <img src="/partner3.png" alt="Partner 3" className="h-16" />
        </div>
      </section>
    <section id="contact" className="max-w-6xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-4xl font-bold text-gray-900 text-center">Contact Us</h2>
      <Separator className="my-6 mx-auto w-1/6" />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Contact Information */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h3>
          <div className="space-y-4">
            <p className="flex items-center text-gray-700">
              <MapIcon className="h-6 w-6 text-blue-600 mr-3" />
              contact@realestatehub.com
            </p>
            <p className="flex items-center text-gray-700">
              <PhoneIcon className="h-6 w-6 text-blue-600 mr-3" />
              +1 (555) 123-4567
            </p>
            <p className="flex items-center text-gray-700">
              <MapPinIcon className="h-6 w-6 text-blue-600 mr-3" />
              123 Real Estate St, New York, USA
            </p>
          </div>

          {/* Social Media Links */}
          <div className="mt-6 flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Right: Embedded Google Map */}
        <div>
          <iframe
            title="Google Map"
            className="w-full h-64 rounded-lg shadow-md"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.27991483706!2d-74.25986510504349!3d40.697670063815554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xd6e5e8fdbb8dcd1!2sNew%20York%2C%20USA!5e0!3m2!1sen!2s"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
    <footer className="text-center bg-white p-4 mt-10 shadow-md">
        <p className="text-gray-600">© {new Date().getFullYear()} Real Estate Hub. All rights reserved.</p>
      </footer>
      {/* Our Trusted Partners */}
    </div>
  );
}
