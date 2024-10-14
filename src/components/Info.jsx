import React from 'react'
import {
  ModalHeader,
  ModalDescription,
  ModalContent,
  ModalActions,
  Button,
  Icon,
  Image,
  Modal,
} from 'semantic-ui-react'

const ModalExampleScrollingContent = (prop) => {
  const [open, setOpen] = React.useState(false)

  return (
    <span  id="leave-button" >
   
                <Button basic color="grey" style={{position:'relative',marginBottom:10}}  onClick={() => prop.setGameId(0)}><i className="fas fa-sign-out-alt"></i> EXIT <span id="gameId">{prop.gameId}</span></Button><br/>
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      size='tiny'
      trigger={<Button basic color="grey" style={{position:'relative'}}>SideBets Info</Button>}
    >
      <ModalHeader>SideBets Info</ModalHeader>
      <ModalContent scrolling>
      

        <ModalDescription>
        <article data-target="toc" data-el="SitemapPage616">
		
<h2 id="perfect-pairs-blackj">Perfect Pairs Blackjack Side Bet</h2>
<p>What is Perfect Pairs in Blackjack? The Perfect Pairs side bet uses the player’s cards only and pays out if you are dealt two of a kind as follows:</p>
<p>Mixed pair (two of the same value but different suits and colors) – pays 5:1</p>
<img class="content-img" loading="lazy" src="/imgs/info/bac55199ac.jpg" alt="mp"/>
<p>Colored pair (two of the same value and the same color) – pays 12:1</p>
<img class="content-img" loading="lazy" src="/imgs/info/bac45939d7.jpg" alt="cp"/>
<p>Perfect pair (two of the same card) – pays 25:1</p>
<img class="content-img" loading="lazy" src="/imgs/info/babf3ee265.jpg" alt="pp"/>
<hr/>
<h2 id="21-3-blackjack-side">21+3 Blackjack Side Bet</h2>
<p>What is 21+3 in Blackjack? The 21+3 side bet involves the player’s two cards and the upturned card of the dealer. It will pay out for a number of different combinations:</p>
<p><b>Flush</b> – (all cards are suited) – pays 5:1</p>
<img class="content-img" loading="lazy" src="/imgs/info/bb73be49dc.jpg" alt="Flush"/>
<p><b>Straight</b> – (all cards consecutive) – pays 10:1</p>
<img class="content-img" loading="lazy" src="/imgs/info/bb808e9616.jpg" alt="straight"/>
<p><b>Three of a kind</b> – (not the same suit) – pays 30:1</p>
<img class="content-img" loading="lazy" src="/imgs/info/bb91b7b5d5.jpg" alt="3"/>
<p><b>Straight flush</b> – (consecutive cards same suit) – pays 40:1</p>
<img class="content-img" loading="lazy" src="/imgs/info/bb980b0d92.jpg" alt="straight flush"/>
<p><b>Suited triple</b> – (three of the same card) – pays 100:1</p>
<img class="content-img" loading="lazy" src="/imgs/info/bb9d24813a.jpg" alt="suited triple"/>

	</article>
        </ModalDescription>
      </ModalContent>
     
    </Modal>
    </span>
  )
}

export default ModalExampleScrollingContent