"use client"
import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faSpinner, faTimes, faCheck, faXmark, faArrowDown, faArrowUp, faMoon, faSun } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Music, Play, Users, Award, Twitter, Headphones, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"


const GuessCard = ({ guess, index }) => {
  const { matchStatus } = guess

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-semibold">
              {index + 1}
            </span>
            <div>
              <h3 className="font-semibold">{guess.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{guess.artists[0].name}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={matchStatus.nameMatch ? "success" : "destructive"}>
              <FontAwesomeIcon icon={matchStatus.nameMatch ? faCheck : faXmark} className="mr-1" />
              Title
            </Badge>
            <Badge variant={matchStatus.artistMatch ? "success" : "destructive"}>
              <FontAwesomeIcon icon={matchStatus.artistMatch ? faCheck : faXmark} className="mr-1" />
              Artist
            </Badge>
            <Badge variant={matchStatus.genreMatch ? "success" : "destructive"}>
              <FontAwesomeIcon icon={matchStatus.genreMatch ? faCheck : faXmark} className="mr-1" />
              Genre
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <FontAwesomeIcon
                icon={matchStatus.yearDiff > 0 ? faArrowDown : faArrowUp}
                className="mr-1 text-indigo-500"
              />
              {Math.abs(matchStatus.yearDiff)} year{Math.abs(matchStatus.yearDiff) !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default GuessCard
