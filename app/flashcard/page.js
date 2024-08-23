'use client'

import {useUser} from '@clerk/nextjs'
import {useEffect, useState} from 'react'
import { Box, Card, CardActionArea, CardContent, Container, Typography, Grid } from '@mui/material'
import {collection, doc, getDoc, getDocs} from 'firebase/firestore'
import {db} from '@/firebase'
import {useSearchParams} from 'next/navigation'

export default function Flashcard() {
	const { isLoaded, isSignedIn, user } = useUser()
	const [flashcards, setFlashcards] = useState([])
	const [flipped, setFlipped] = useState({})
    const [loading, setLoading] = useState(true)
	const [flippedIndex, setFlippedIndex] = useState(-1);

	const searchParams = useSearchParams()
	const search = searchParams.get('id')
  
	useEffect(() => {
		async function getFlashcard() {
		console.log("getFlashcard function called")
		console.log("search:", search)
		console.log("user:", user)
	  
		  if (!search || !user) {
			console.log("Search or user is missing")
			setLoading(false)
			return
		  }

		  try {
			const flashcardSetRef = doc(db, 'users', user.id, 'flashcardSets', search)
			console.log("Attempting to fetch document from:", flashcardSetRef.path)

			const docSnap = await getDoc(flashcardSetRef)

      		 if (docSnap.exists()) {
				const data = docSnap.data()
				console.log("Fetched flashcard set data:", data)
				
				if (data && Array.isArray(data.flashcards)) {
					setFlashcards(data.flashcards)
					console.log("Fetched flashcards:", data.flashcards)
				} else {
					console.log("No flashcards array found in the document")
					setFlashcards([])
				}
			} else {
				console.log("No such document!")
				setFlashcards([])
			}
			} catch (err) {
				console.error('Error fetching flashcards:', err)
			} finally {
				setLoading(false)
				}
		}
		getFlashcard()
	}, [search, user])

		
	const handleCardClick = (index) => {
		setFlippedIndex((prevIndex) => {
		// If the clicked card is already flipped, flip it back
		if (prevIndex === index) {
			return -1;
		}
		// Otherwise, flip the new card and reset the previous one
		return index;
		});
	};

	return (
		<Container maxWidth="md">
		  <Grid container spacing={3} sx={{ mt: 4 }}>
					{flashcards.map((flashcard, index) => (
					<Grid item xs={12} sm={6} md={4} key={index}>
						<Card>
						<CardActionArea 
							onClick={() => {
							handleCardClick(index)
							}}
						>
						<CardContent>
						<Box sx = {{
							perspective: '1000px',
							'& > div': {
								transition: 'transform 0.6s',
								transformStyle: 'preserve-3d',
								position: 'relative',
								width: '100%',
								height: '200px',
								boxShadow: '0 4px 8px rgba(0,0,0, 0.2)',
								transform: 
								index == flippedIndex
								? 'rotateY(180deg)' 
								: 'rotateY(0deg)',
							},

							'& > div > div': {
								position: 'absolute',
								width: '100%',
								height: '100%',
								backfaceVisibility: 'hidden',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								padding: 2,
								boxSizing: 'border-box'
							},

							'& > div > div:nth-of-type(2)':{
								transform: 'rotateY(180deg)'
							}
							
							}}>
								<div>
								<Typography variant="h5" component="div">
									{flashcard.front}
									</Typography>
								<Typography variant="h6" component="div" 
								sx={{
									overflow: 'hidden',
									textOverflow: 'ellipsis',
   								}}>
									{flashcard.back}
								</Typography>
								</div>
							</Box>
							</CardContent>
						</CardActionArea>
						</Card>
					</Grid>
					))}
		  </Grid>
		</Container>
	  )
  }