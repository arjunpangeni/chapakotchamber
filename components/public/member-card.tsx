'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import cloudinaryLoader from '@/lib/cloudinary-loader'

interface MemberCardProps {
  id: string
  businessName: string
  owner: string
  type: string
  ward: string
  contact: string
  image?: string
}

export function MemberCard({ id, businessName, owner, type, ward, contact, image }: MemberCardProps) {
  return (
    <Link href={`/members/${id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        {image && (
          <div className="relative h-48 w-full bg-slate-200 dark:bg-slate-700">
            <Image
              src={image}
              loader={cloudinaryLoader}
              alt={businessName}
              fill
              sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-lg">{businessName}</CardTitle>
          <CardDescription>{owner}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{type}</Badge>
            <Badge variant="outline">{ward}</Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{contact}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

