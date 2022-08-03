import React, { useState, useEffect } from 'react';
import BookingSummary from '../bookingSummary';
import {
	Button,
	ButtonContainer,
} from '../../../../reuseableComponents/buttonStyle';
import {
	ContentContainer,
	RightContent,
	RightContentCol1,
	RightContentCol2,
} from '../../../../reuseableComponents/containerStyle';
import Sidebar from '../../../sidebar';
import {
	HeadingStyle,
	Back,
} from '../../../../reuseableComponents/headingStyle';
import { MdChevronLeft } from 'react-icons/md';
import {
	EnterDetailsContainer,
	FormField,
	InputField,
	Comment,
	ErrorMsg,
	Policy,
} from './enterDetailsStyle';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CheckBox from '../../../../reuseableComponents/Checkbox';
import { hideLoader, showLoader } from '../../../loader/loader';
import { axiosCalls } from '../../../../_api';
import { Toast } from '../../../toast/index';
import { useNavigate } from 'react-router-dom';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import './index.css';
import tick from '../../../../images/tick2.png';

function EnterDetails() {
	const navigation = useNavigate();
	const [location, setlocation] = useState({});
	const [servicessTA, setservicessTA] = useState({});
	const [selectedTech, setselectedTech] = useState({});
	const [selectedTime, setselectedTime] = useState({});
	const [bookingType, setBookingType] = useState('');
	const [amount, setAmount] = useState('');
	const [allAmountSt, setAllAmountSt] = useState([]);
	const [open, setOpen] = useState(false);
	const onOpenModal = () => setOpen(true);
	const onCloseModal = () => setOpen(false);

	useEffect(() => {
		let locationSt = localStorage.getItem('location');
		let servicesSt = localStorage.getItem('services');
		let techSt = localStorage.getItem('technician');
		let timeSt = localStorage.getItem('time');
		let allAmount = localStorage.getItem('allAmount');
		let bookingTypeg = localStorage.getItem('bookingType');

		if (locationSt) {
			locationSt = JSON.parse(locationSt);
			console.log('location>>>>>>>>vvvvv>>>>>>>>>>>', locationSt);
			setlocation(locationSt);
		}

		if (bookingTypeg) {
			console.log('Booking Type>>>>>>>', bookingTypeg);
			setBookingType(bookingTypeg);
			if (bookingTypeg == 'group') {
				if (allAmount) {
					let alv = JSON.parse(allAmount);
					setAllAmountSt(alv);
				}
			}
		}

		if (servicesSt) {
			servicesSt = JSON.parse(servicesSt);
			console.log('services>>>>>>>', servicesSt);
			setservicessTA(servicesSt);
		}
		if (techSt) {
			techSt = JSON.parse(techSt);
			console.log('tech>>>>>>>', techSt);
			setselectedTech(techSt);
		}
		if (timeSt) {
			// timeSt = JSON.parse(timeSt);
			console.log('time>>>>>>>', timeSt);
			setselectedTime(timeSt);
		}
	}, []);
	const formik = useFormik({
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			comment: '',
		},
		validationSchema: Yup.object({
			firstName: Yup.string()
				.max(15, 'Must be 15 characters or less')
				.required('*Required'),
			lastName: Yup.string()
				.max(15, 'Must be 15 characters or less')
				.required('*Required'),
			email: Yup.string()
				.email('Invalid Email')
				// .max(15, "Must be 15 characters or less")
				.required('*Required'),
			phone: Yup.string()
				.max(15, 'Must be 15 characters or less')
				.required('*Required'),
		}),
		onSubmit: (values) => bookAppointment(values),
	});
	console.log(formik.values);

	const bookAppointment = async (values) => {
		if (bookingType == 'group') {
			let amountL = localStorage.getItem('amount');
			if (amountL) {
				console.log('amount>>>>>>>>vvvvv>>>>>>>>>>>', amountL);
				setAmount(amountL);
			}
		}

		let date = localStorage.getItem('date');
		showLoader();
		const data = {
			booked_technician: selectedTech.technician_id,
			customer: {
				first_name: values.firstName,
				last_name: values.lastName,
				email: values.email,
				mobile: values.phone,
			},
			bookedDate: new Date(date),
			isGroup: bookingType == 'group' ? true : false,
			location: location.location_code,
			services: allAmountSt.map((data) => {
				return data.id;
			}),
		};
		console.log(data);
		const res = await axiosCalls(`booking`, 'POST', data);
		if (res) {
			hideLoader();
			if (res.status === 200) {
				console.log(res);
				Toast('success', res.message);
				onOpenModal();
				return;
			}
			console.log(res);
			Toast('error', res.er.message);
		}
	};

	return (
		<ContentContainer>
			<Sidebar />
			<RightContent>
				<RightContentCol1>
					<HeadingStyle>
						<h2>Enter your details</h2>
						<Back to='/my-appointments/group-booking/schedule'>
							<MdChevronLeft />
							Go back
						</Back>
					</HeadingStyle>
					<div>
						<EnterDetailsContainer>
							<FormField onSubmit={formik.handleSubmit}>
								<div className='names'>
									<InputField>
										<label htmlFor='firstName'>First Name</label>
										<input
											type='text'
											name='firstName'
											id='firstName'
											placeholder='Enter your First Name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.firstName}
										/>
										<ErrorMsg>
											{formik.touched.firstName && formik.errors.firstName ? (
												<p>{formik.errors.firstName}</p>
											) : null}
										</ErrorMsg>
									</InputField>
									<InputField>
										<label htmlFor='lastName'>Last Name</label>
										<input
											type='text'
											name='lastName'
											id='lastName'
											placeholder='Enter your Last Name'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.lastName}
										/>
										<ErrorMsg>
											{formik.touched.lastName && formik.errors.lastName ? (
												<p>{formik.errors.lastName}</p>
											) : null}
										</ErrorMsg>
									</InputField>
								</div>
								<InputField>
									<label htmlFor='email'>Email</label>
									<input
										type='email'
										name='email'
										id='email'
										placeholder='Enter your Email'
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.email}
									/>
									<ErrorMsg>
										{formik.touched.email && formik.errors.email ? (
											<p>{formik.errors.email}</p>
										) : null}
									</ErrorMsg>
								</InputField>
								<InputField>
									<label htmlFor='phone'>Phone Number</label>
									<input
										type='text'
										name='phone'
										id='phone'
										placeholder='Enter phone number'
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.phone}
									/>
									<ErrorMsg>
										{formik.touched.phone && formik.errors.phone ? (
											<p>{formik.errors.phone}</p>
										) : null}
									</ErrorMsg>
								</InputField>
								<Comment>
									<label htmlFor='comment'>Comment</label>
									<textarea
										name='comment'
										id='comment'
										rows={1}
										cols={6}
										placeholder='Comment (optional)'
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.comment}
									></textarea>
								</Comment>
								<CheckBox label='Remember Me' name='remember' />
							</FormField>
						</EnterDetailsContainer>
						<Policy>
							<h2>Company Policy</h2>
							<p>
								Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
								commodo ligula eget dolor. Aenean massa. Cum sociis natoque
								penatibus et magnis dis parturient montes, nascetur ridiculus
								mus. Donec quam felis, ultricies nec, pellentesque eu, pretium
								quis, sem. Nulla consequat massa quis enim. Donec pede justo,
								fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo,
								rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum
								felis eu pede mollis pretium. Integer tincidunt. Cras dapibus.
								Vivamus
							</p>
						</Policy>
					</div>
					<ButtonContainer>
						<Button onClick={formik.submitForm}>NEXT</Button>
					</ButtonContainer>
				</RightContentCol1>
				<RightContentCol2>
					<BookingSummary
						location={location}
						service={servicessTA}
						selectedTech={selectedTech}
						selectedTime={selectedTime}
					/>
				</RightContentCol2>
			</RightContent>

			<Modal
				open={open}
				onClose={onCloseModal}
				center
				showCloseIcon={false}
				closeOnOverlayClick={false}
				closeOnEsc={false}
			>
				<div
					style={{ backgroundColor: '#1C1C1C' }}
					className='successModalBooking'
				>
					<img src={tick} alt='tick' />
					<h2>Success!</h2>
					<p>Booking Successfull, please check email for more information</p>
					<button
						onClick={() => {
							navigation('/');
						}}
					>
						GO BACK HOME
					</button>
				</div>
			</Modal>
		</ContentContainer>
	);
}

export default EnterDetails;
