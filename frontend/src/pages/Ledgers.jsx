import {useState, useEffect} from 'react';
import axios from 'axios';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdPostAdd } from 'react-icons/md'
import Chart from 'chart.js/auto'
import { FiSave } from 'react-icons/fi'
import { toast } from 'react-toastify';
import { BsDash} from 'react-icons/bs'
const qs = require('qs');

function Ledgers({handleIsLoading}) {
    const [ledgerRows, setLedgerRows] = useState([]);
    //These are the rows of the current ledger being shown
    const [ledgerNames, setLedgerNames] = useState([]);
    //This contains all of the ledger names to be displayed in the <Select>
    const [currentLedgerID, setCurrentLedgerID] = useState("");
    //This is used for axios to update the coorect ledger
    const [currentLedgerName, setCurrentLedgerName] = useState("");
    //Ease the program for the developer
    const [cacheResponse, setCacheResponse] = useState([]);
    //Cache the entire response so that it doesn't have to be requested every time
    const [editedLedgerName, setEditedLedgerName] = useState("");
    //This will be used when the user is edting the name of a ledger
    const [inSettings, setInSettings] = useState(0);
    //If they are in the settings mode or not.
    const [balance, setBalance] = useState(0);
    useEffect(() => {
        setLedgerRows([])
        getLedgers();
    }, [] //having the empty array as an initial value will cause the effect to run only once
          //CHANGING THIS WILL CAUSE IT TO CRASH BECAUSE OF ALL THE RENDERING
          // if there is an item in the array, useEffect will run when that item is changed.
          //Since it is blank, It will only run once.
    );
    useEffect(() =>{
        calculateBalance();
    
        let labels=[]
        let data=[]
        let debitData =[]
        let creditData =[]
        let balanceData = []
        const bchrt = document.getElementById('balanceChart').getContext('2d');
        ledgerRows.forEach(elements =>{
            labels.push(elements.date)
            data.push(elements.balance)
            debitData.push(elements.debit)
            creditData.push(elements.credit)
            balanceData.push(elements.balance) 
        })
    
        const chart = new Chart(bchrt, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'Debit',
                  backgroundColor: 'rgb(54, 162, 235)',
                  borderColor: 'rgb(54, 162, 235)',
                  data: debitData
                },
                {
                  label: 'Credit',
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgb(255, 99, 132)',
                  data: creditData
                },
                {
                  label: 'Balance',
                  backgroundColor: 'rgb(75, 192, 192)',
                  borderColor: 'rgb(75, 192, 192)',
                  data: balanceData 
                }
              ]
            },
            options: {
                plugins: {
                  title: {
                    display: true,
                    text: 'Balance, Debit and Credit over Time',
                    font: {
                      size: 16,
                    },
                  },
                  legend: {
                    display: true,
                    position: 'bottom',
                  },
                },
                responsive: true,
                maintainAspectRatio: false, 
              },
            });
          
          
          return () =>{
            chart.destroy()
    
          }
    },[ledgerRows])

    const getLedgers = async () => {
        handleIsLoading(true);
        try {
            const userIDCookie = document.cookie.split("=")[1]; 
            const token = userIDCookie.split(";")[0];
            //get the token from the cookie
            const data = qs.stringify({
                ledgerName: undefined
            });
            //as it is undefined, it will not get a specific ledger, as made in the controller
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${process.env.REACT_APP_SERVER_URL}/api/Ledgers`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            };
            //make a request with the bearer token, data and other headers
            const response = await axios.request(config); // an asynchronous call to our api
            //they were made asynchronous so that the server can handle promises much better
            //promises are very necessary for website applications like this were a lot of calls could be made simultaneously
            const newLedgerNames = [];
            let ledgerData ="";
            for (let i = 0; i < response.data.length; i++) {
                //for each piece of data in the response data (all data in all ledgers)
                let ledgerName = response.data[i].ledgerName;
                newLedgerNames.push(ledgerName);
                //push teh ledger names to the <select> so that the user can select their ledger
                ledgerData = response.data[0].ledgerData;
                // response.data[0] is the first created ledger
                if(response.data.ledgerData!=null && response.data[i].ledgerData.length !== 0) {
                    //if it is not null, set the ledgerData (current ledger) to have all the rows equal the saved data
                    response.data[i].ledgerData.forEach(element => {
                        setLedgerRows(LedgerRows => [...LedgerRows, {
                            date: element.date,
                            notes: element.notes,
                            debit: element.debit,
                            credit: element.credit,
                            balance: element.balance
                        }]);
                    })
                }
                setCurrentLedgerID(response.data[0]._id);
                setCurrentLedgerName(response.data[0].ledgerName);
                //set these usestates for easier usage later on for other calls
            }
            if(ledgerData!=null){
                setLedgerRows(ledgerRows => [...ledgerRows,...ledgerData]);
                //If there is nothing in ledgerData, add a blank row
            }
            setCacheResponse(response.data);
            setLedgerNames(newLedgerNames);
            //set current ledger to the first ledger as this
            //will be first by default
            handleIsLoading(false);
        } catch (error) {
            console.log(error);
            handleIsLoading(false);
        }
    };
    
    const changeLedger = (name) => {
        let ledgerData = ""
        cacheResponse.forEach(element => {
            //Check the cached Response to get the data from the ledger
            if(element.ledgerName === name) {
                ledgerData = element.ledgerData;
                setCurrentLedgerID(element._id);
            }
        })
        setCurrentLedgerName(name);
        if(ledgerData!==""){
            console.log(ledgerData);
            setLedgerRows([])
            ledgerData.forEach(element => {
                setLedgerRows(LedgerRows => [...LedgerRows, {
                    date: element.date,
                    notes: element.notes,
                    debit: element.debit,
                    credit: element.credit,
                    balance: element.balance
                }]);
            })
            //if there is data, set the data to be displayed in the ledger
        }else{
            setLedgerRows(LedgerRows => [{date: "", notes: "", debit: 0, credit: 0, balance: 0}])
            //adds a new blank row to the table as nothing exists for the ledger
        }
    }
    const createLedger = async () =>{
        const userIDCookie = document.cookie.split("=")[1];
        const token = userIDCookie.split(";")[0];
        if(ledgerNames.includes("New Ledger")){
            toast.error("You already have a new Ledger, rename or delete it!")
            return
        }
        //get the token
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_SERVER_URL}/api/Ledgers`,
            headers: { 
                    'Authorization': `Bearer ${token}`,
            },
            data: {
                ledgerName: "New Ledger"
            }
        };
        try {
            //Create a new ledger with the temporary name of "New Ledger"
            const response = await axios.request(config);
            //we dont need any response necessarily, just whether it was successful (where it is reloaded)
            setLedgerNames([...ledgerNames, "New Ledger"])
            setCurrentLedgerID(response.data._id)
            setCurrentLedgerName("New Ledger")
            const newCacheResponse = [...cacheResponse];
            newCacheResponse.push(response.data)
            setCacheResponse(newCacheResponse)
            toast.success("a new ledger has been created!")
        } catch (error) {
            console.log(error);
            //else an error is shown to the user
        } 
    }
    
    const updateLedger = async (config) => {
        try {
          const response = await axios.request(config);
          cacheResponse.forEach((element, index) => {
            if (element.ledgerName === currentLedgerName) {
              const newCacheResponse = [...cacheResponse];
              newCacheResponse[index] = response.data;
              setCacheResponse(newCacheResponse);
              const newLedgerNames = [...ledgerNames];
              newLedgerNames[index] = response.data.ledgerName;
              setLedgerNames(newLedgerNames);
              toast.success("Ledger updated successfully");
            }
          });
          setEditedLedgerName("");
        } catch (error) {
          console.error(error);
          toast.error("Ledger update failed");
        }
      };
      
      const onSave = async () => {
        const userIDCookie = document.cookie.split("=")[1];
        const token = userIDCookie.split(";")[0];

        const updatedLedgerRows = [];
        let previousBalance = 0;
        ledgerRows.forEach((row, index) => {
          const debit = row.debit || 0;
          const credit = row.credit || 0;
          const balance = index === 0 ? debit + credit : previousBalance + debit + credit;
          const updatedRow = { ...row, balance };
          updatedLedgerRows.push(updatedRow);
          previousBalance = balance;
        });

        const config = {
          method: 'put',
          maxBodyLength: Infinity,
          url: `${process.env.REACT_APP_SERVER_URL}/api/Ledgers/update`,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            _id: currentLedgerID,
            ledgerData: updatedLedgerRows,
            balance: balance
          }
        };
        cacheResponse.forEach((element) => {
          if (element.ledgerName === editedLedgerName) {
            toast.error(`You already have a ledger called ${element.ledgerName}`);
            setEditedLedgerName("");
            return;
          }
        });
        if (editedLedgerName !== "") {
          config.data.ledgerName = editedLedgerName;
        }
        try {
          await updateLedger(config);
          toast.success("Ledger updated successfully");
        } catch (error) {
          toast.error("Ledger update failed");
        }
        document.getElementById("saveButton").classList.add("hidden");
      };
    
        
    const addRow = () => {
        const newRow = {
          date: '',
          notes: '',
          debit: '',
          credit: '',
          balance: ''
        };
 
        setLedgerRows([...ledgerRows, newRow]);
        //adds a new blank row to the table
    };
    
    const deleteRow = (index) => {
        const updatedLedgerRows = [...ledgerRows];
        updatedLedgerRows.splice(index, 1)
        setLedgerRows(updatedLedgerRows)
        document.getElementById("saveButton").classList.remove("hidden")
    }
    const calculateBalance = () => {
        let balance = 0;
        let data = [];
        ledgerRows.forEach((element, index) => {
          const debit = Number(element.debit);
          const credit = Number(element.credit)*-1; //negative
          const newBalance = balance + debit - credit;
          //calculates the balance in accordance to double entry bookkeeping
          //debit being positive
          //credit being negative
          balance = newBalance;
          data.push(newBalance);
        });
        setBalance(balance)
    }
    const deleteLedger = async () => {
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_SERVER_URL}/api/Ledgers/delete`,
            headers: {},
            data: {
                _id: currentLedgerID
            }
        };
        try {
            const response = await axios.request(config);
            const newCacheResponse = [...cacheResponse];
            newCacheResponse.splice(newCacheResponse.indexOf(response.data), 1);
            const newLedgerNames = [...ledgerNames];
            newLedgerNames.splice(newLedgerNames.indexOf(response.data.ledgerName), 1);
            setLedgerNames(newLedgerNames)
            setCacheResponse(newCacheResponse);
            getLedgers()
            toast.warn("Ledger Deleted");
        } catch (error) {
            console.log(error);
        }
    };

    const onChangeCell = (event, index, key) => {
        const newRows = [...ledgerRows];
        let value = event.target.value; 
        if (key === "credit" && value > 0) {
            value = -1 * value;
        }
        //Credit needs to be negative

        newRows[index][key] = value;
        //get the index (row) and the actual cell being changed
        setLedgerRows(newRows);
        //set the ledgerRows to contain the data from the new row
        const button = document.getElementById("saveButton")
        if(cacheResponse===ledgerRows){
            button.classList.add("hidden")
        }else{
            button.classList.remove("hidden")
        }
    }

    return(
            <div className='transition-all ease-in delay-300 '>
            <div className="chartContainer bg-white rounded-xl shadow-2xl p-2 mb-5">
                <div className="chartItem" >
                    <canvas id="balanceChart"></canvas>
                </div>
            </div>
            
            <div className="bg-white pb-16 w-full m-auto p-4 rounded-xl shadow-2xl">
                <div className="border flex align-center p-2 ledgerOptions">
                        <h1 className='text-xl mr-3'> Select ledger: </h1>
                        <select className='ml-4 md:ml-0 text-xl text-center rounded-md col-span-4 w-1/2' onChange={(event) =>changeLedger(event.target.value)}>
                            { ledgerNames.map((ledgerName, index) => (
                                <option key={index} value={ledgerName}>{ledgerName}</option> 
                                ))}
                        </select>
                        <div className="">
                            <button id="new" className="ml-4 mr-4 text-xl rounded-md p-1 w-1/12" value={"New"} onClick={()=>createLedger()}><MdPostAdd size={30}/></button>
                            <button id="settings" className="ml-4 text-xl rounded-md p-1 w-1/12" onClick={()=>setInSettings(!inSettings)}><AiOutlineEdit size={30}/></button>
                        </div>
                    </div>

                {inSettings ? 
                <div className="">
                    <div className="w-full mb-2 p-10 border rounded m-auto grid grid-row-2 align-middle justify-center bg-gray-200"> 
                            <div className="shadow border rounded py-2 px-3 text-gray-700 mb-3 w-full">
                                <label className='text-xl p-1'> Ledger Name: </label>
                                <input className="" type="text" value={editedLedgerName} onChange={(event)=>setEditedLedgerName(event.target.value)}/>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3" onClick={()=>onSave()}>Save</button>
                            </div>
                            <div className="shadow border rounded py-2 px-3 text-gray-700 mb-3 align-middle justify-center m-auto">
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" value={currentLedgerName} onClick={()=>deleteLedger()}>Delete Ledger</button>
                            </div>
                    </div>
                </div>
                 : 
                <table className="table-auto w-full h-auto md:table-fixed sm:table-fixed">
                <thead>
                    <tr>
                        <th className="w-2/12 border-t border-l">Date</th>
                        <th className="w-5/12 border-t border-l">Notes</th>
                        <th className="w-2/12 border-t border-l">Debit</th>
                        <th className="w-2/12 border-t border-l">Credit</th>
                        <button className="w-1/12"onClick={addRow}>+</button>
                    </tr>
                </thead>
                <tbody>
                    {ledgerRows.map((row, index) => (
                    <tr key={index} className="h-10 bg-slate-200 rounded shadow-sm sm:text-left hover:bg-slate-300 transition-all ease-in-out duration-300" ref={event => (row[index] =event)}>
                        <td className="p-1">
                            <label className="block w-full bg-slate-50 sm:hidden">Date</label>
                            <input className="rounded pl-2 bg-slate-50 w-full shadow-sm" value={row.date} onChange={(event)=>onChangeCell(event, index, "date")} type="date" required />
                        </td>
                        <td className="p-1">
                            <label className="block bg-slate-50 sm:hidden">Notes</label>
                            <input className="rounded pl-2 bg-slate-50 w-full shadow-sm " value={row.notes} onChange={(event)=>onChangeCell(event, index, "notes")} type="text" required />
                        </td>
                        <td className="p-1">
                            <label className="block bg-slate-50 sm:hidden">Debit</label>
                            <span className="absolute pl-1 sm:hidden md:hidden gbp">£</span>
                            <input className="rounded pl-4 bg-slate-50 w-full shadow-sm text-green-500" value={row.debit} onChange={(event)=>onChangeCell(event, index, "debit")} type="number" required min={0}/>
                        </td>

                        <td className="p-1">
                            <label className="block bg-slate-50 sm:hidden">Credit</label>
                            <span className="absolute pl-1 sm:hidden md:hidden gbp">£ -</span>
                            <input className="rounded pl-5 bg-slate-50 w-full shadow-sm text-red-500" value={row.credit} onChange={(event)=>onChangeCell(event, index, "credit")} type="number" required min={-1} />
                        </td>
                        <td className="p-1">
                            <label className="block bg-slate-50 lg:hidden md:hidden  cursor-pointer " onClick={()=>deleteRow(index)}>Delete row</label>

                            <button className=""onClick={()=>deleteRow(index)}> <BsDash /></button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            }
                <label className="block bg-slate-50 lg:hidden md:hidden  cursor-pointer " onClick={addRow}>Add new row</label>
                

                <div className="w-4/12 float-right text-lg">
                    <label className="bg-slate-50">Balance</label>
                    <input className="gpb rounded pl-4 bg-slate-300 shadow-sm float-right" value={balance} required />
                </div>
            </div>
            <button onClick={onSave} id="saveButton"className="transition-all ease-in-out duration-75 rounded-full fixed bottom-10 right-10 bg-green-700 p-3 hidden"><FiSave size={50}/></button>          

        </div>
        
        )
    }


export default Ledgers; 