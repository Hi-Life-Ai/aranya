import React, { useContext, useEffect, useState } from 'react';
import CanvasJSReact from './canvasjs.react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from '../services/Baseservice';
import { AuthContext } from '../context/Appcontext';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const getcmonth = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
];
const valnmonth = monthNames[getcmonth.getMonth()];

function Dashpiechart({isLocations, isLocationChange}) {

	const { auth, setngs } = useContext(AuthContext);
	const [dataPoints, setDataPoints] = useState([])
	let resultsdata =[]

	let posData = []
	let collections = []
	var colors = ["#2F4F4F", "#008080", "#2E8B57", "#3CB371", "#90EE90"];

	//	fetch pos data
	const fetchPos = async () => {
		try {
			let res = await axios.get(SERVICE.POS, {
				headers: {
					'Authorization': `Bearer ${auth.APIToken}`
				},
			})
			let posresult = res.data.pos1.filter((data, index)=>{
				if(isLocationChange){
					if(data.assignbusinessid == setngs.businessid && isLocations == data.location){
						resultsdata.push(data);
					}
				}else{
					if(data.assignbusinessid == setngs.businessid){
						resultsdata.push(data);
					}
				}	
			  })			  
			     resultsdata.filter((data) => {
				posData.push(...data.goods)
			})

			const result = [...posData.reduce((r, o) => {
				const key = o.productname;
				const items = r.get(key) || Object.assign({}, o, {
					quantity: 0,
				});
				items.quantity += +o.quantity
				return r.set(key, items);
			}, new Map).values()];

			let highestValue = result.reduce((max, obj) => obj.quantity > max ? obj.quantity : max, result[0].quantity)
			let lastvalue = result.filter((data, i) => {
				return data.quantity <= highestValue && i < 5
			})
			collections = lastvalue.map(function (data, i) {
				return { y: +data.quantity, label: data.productname, color: colors[i] };
			});
			setDataPoints(collections);

		} catch (err) {
			const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
		}
	}

	useEffect(
		()=>{
		fetchPos();

	},[dataPoints, isLocations])

	const options = {
		animationEnabled: true,
		exportEnabled: true,
		theme: "light1",
		title: {
			text: `Top Selling Products (${valnmonth})`,
			fontSize: 18,
			fontFamily: "tahoma",
			fontWeight: "600",
		},
		data: [
			{
				startAngle: -90,
				type: "pie",
				dataPoints: dataPoints,
			},
		],
	};
	return (
		<div> 
			<CanvasJSChart sx={{width:'100%'}} options={options} />
		</div>
	);
}
export default Dashpiechart;