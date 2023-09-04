import React, { useState, useEffect, useContext } from 'react';
import CanvasJSReact from './canvasjs.react';
import axios from 'axios';
import { SERVICE } from '../services/Baseservice';
import moment from "moment";
import { AuthContext, UserRoleAccessContext } from '../context/Appcontext';
import { toast } from 'react-toastify';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Dashbrdchart = ({ isLocations, isLocationChange }) => {

	const [dataPoints, setDataPoints] = useState([]);
	const { auth, setngs } = useContext(AuthContext);
	const [apidata, setApidata] = useState([]);
	const currentDate = new Date();
	const { isUserRoleAccess, setAllPos, setIsActiveLocations, setAllLocations, setAllPurchases, isUserRoleCompare, isActiveLocations, allPurchases, allPos } = useContext(UserRoleAccessContext);

	var colors = ["#2F4F4F", "#008080", "#2E8B57", "#3CB371", "#90EE90", "#2F4F4F", "#008080",];

	let allArray = [];
	let resultsdata = []
	const previousWeekDates = [];

	for (let i = 1; i <= 7; i++) {
		const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7 + i);
		previousWeekDates.push(moment(previousDate).utc().format('DD-MM-YYYY'));

	}


	// pos Data fetching get call
	const fetchPos = async () => {
		try {
			// let res = await axios.post(SERVICE.POS, {
			// 	headers: {
			// 		'Authorization': `Bearer ${auth.APIToken}`
			// 	},
			// 	locationid: String(setngs.businesscation),
			// 	userassignedlocation: [isUserRoleAccess.businesslocation],
			// 	role: String(isUserRoleAccess.role),
			// })

			let posresult = allPos?.filter((data, index) => {
				if (isLocationChange) {
					return isLocations == data.location
				} else {
					return data
				}
			})
			posresult.map((data, index) => {
				data?.goods?.map((item, i) => {
					resultsdata?.push(data);
				})
			})


			let checkcompare = resultsdata?.filter((data) => {
				let dateTrim = moment(data.date).utc().format('DD-MM-YYYY')
				if (previousWeekDates.includes(dateTrim)) {
					return data
				}
			})
			setApidata(checkcompare)


		} catch (err) {
			const messages = err?.response?.data?.message;
			if (messages) {
				toast.error(messages);
			} else {
				toast.error("Something went wrong!")
			}
		}
	}

	useEffect(() => {
		const result = [...apidata.reduce((r, o) => {
			const key = moment(o.date).utc().format('DD-MM-YYYY');
			const items = r.get(key) || Object.assign({}, o, {
				grandtotal: 0
			});
			items.grandtotal += +o.grandtotal
			return r.set(key, items);
		}, new Map).values()];
		const allArray = result?.map(function (data, i) {
			return { label: moment(data.date).utc().format('DD-MM-YYYY'), y: data.grandtotal, color: colors[i] };
		});
		setDataPoints(allArray);
	}, [apidata]);


	useEffect(
		() => {
			fetchPos();
		}, [isLocationChange, isLocations])

	// options for Pos Sales
	const options = {
		animationEnabled: true,
		exportEnabled: true,
		title: {
			text: "Weekly Sales",
			fontSize: 18,
		},
		axisX: {
			title: "Date",
			valueFormatString: "MMM DD"
		},
		axisY: {
			title: "Sales (₹)",
			includeZero: false

		},
		title: {
			text: "Sales (₹)",
			fontFamily: "tahoma",
		},
		data: [
			{
				bevelEnabled: true,
				showInLegend: true,
				type: "column",
				dataPoints: dataPoints,
				name: "sales"
			},
		]
	}

	return (
		<div>
			<CanvasJSChart options={options} /><br /><br />
		</div>
	);

}
export default Dashbrdchart;