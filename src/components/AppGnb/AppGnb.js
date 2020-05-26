import React, { Component } from "react"
import { connect } from "react-redux"
import { Link, NavLink, withRouter } from "react-router-dom"
import styled from "styled-components"
import throttle from "lodash.throttle"

import store from "store"
import { ReactComponent as ufc } from "assets/img/ufc.svg"
import language from "assets/language/language.json"
import { expEmail } from "assets/lib/validation"

const StyledLogo = styled(ufc)`
	fill: ${({ theme }) => theme.logoColor};
`

const Container = styled.nav`
	background-color: ${({ theme }) => theme.bgColor};
	color: ${({ theme }) => theme.textColor};

	position: absolute;
	top: 50px;
	left: 50%;
	transform: translateX(-50%);
	width: 1024px;
	transition: width 1s;

	&.fixed {
		z-index: 100;
		position: fixed;
		top: 0px;
		width: 100vw;
		min-width: 1024px;
		box-shadow: 0 -5px 10px 0px #000;

		.gnb .underline {
			width: 100%;
		}
	}

	&.shadow {
		box-shadow: 0 0px 10px 0px #000;
	}

	.logo {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		svg {
			display: inline-block;
			width: 80px;
			height: auto;
		}
	}

	.gnb {
		display: flex;

		li {
			padding: 1rem;

			&.align-right {
				margin-left: auto;
			}

			&.underline {
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 0px;
				height: 2px;
				border-bottom: 4px solid #cc0b0b;
				padding: 0;
				transition: all 1s ease-in-out;
			}

			a.active {
				color: #cc0b0b;
			}
		}
	}
`

class AppGnb extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isFixed: false
		}
		this.hasLandingContent = true
		this.detectScrollThrottled = throttle(this.detectScroll, 100)
		window.addEventListener("scroll", this.detectScrollThrottled)
	}

	detectScroll = () => {
		if (window.scrollY > 50 && !this.state.isFixed) {
			this.setState({ isFixed: true })
		} else if (window.scrollY <= 50 && this.state.isFixed) {
			this.setState({ isFixed: false })
		}
	}

	temporarilyForbidden = e => {
		e.preventDefault()
		alert("준비중입니다 :-)")
	}

	componentWillUnmount() {
		this.detectScrollThrottled.cancel()
	}

	render() {
		const { className, location } = this.props
		const { isAuth } = store.getState().authReducer
		const { lang } = store.getState().langReducer
		const languageText = language.appGnb
		if (!(location.pathname === "/event" || location.pathname === "/fighter")) {
			this.hasLandingContent = false
		} else {
			this.hasLandingContent = true
		}
		return (
			<Container
				className={`${className}
				${this.state.isFixed ? "fixed" : null}
				${this.hasLandingContent ? null : "shadow"}
			`}>
				<h1 className="logo noTextContent">
					<Link to="/" title="go to home" className="noTextContent">
						<StyledLogo />
					</Link>
				</h1>
				<ul className="gnb" onMouseLeave={this.handleMouseLeave}>
					<li>
						<NavLink to="/event" onMouseOver={this.handleMouseOver}>
							{languageText.list.event[lang]}
						</NavLink>
					</li>
					<li>
						<NavLink to="/fighter" onMouseOver={this.handleMouseOver}>
							선수
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/article"
							onMouseOver={this.handleMouseOver}
							onClick={this.temporarilyForbidden}>
							기사 및 이미지
						</NavLink>
					</li>
					<li className="align-right">
						<NavLink
							to="/live"
							onMouseOver={this.handleMouseOver}
							onClick={this.temporarilyForbidden}>
							Live
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/shop"
							onMouseOver={this.handleMouseOver}
							onClick={this.temporarilyForbidden}>
							Shop
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/support"
							onMouseOver={this.handleMouseOver}
							onClick={this.temporarilyForbidden}>
							Support
						</NavLink>
					</li>
					<li>
						<NavLink to="/my" onMouseOver={this.handleMouseOver}>
							{isAuth ? "My" : "Login"}
						</NavLink>
					</li>
					<li className="underline"></li>
				</ul>
			</Container>
		)
	}
}

const mapStateToProps = state => ({
	isAuth: state.authReducer.isAuth,
	lang: state.langReducer.lang
})

const mapDispatchToProps = {}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppGnb))
