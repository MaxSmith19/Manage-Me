import react, {useState, useEffect} from 'react';
import axios from 'axios';
import { imBin } from 'react-icons/im';
import { AiOutlineEdit } from 'react-icons/ai';
const qs = require('qs');

function Ledgers() {
    const [ledgerRows, setLedgerRows] = useState([]);
    const [ledgerNames, setLedgerNames] = useState([]);
    const [currentLedgerID, setCurrentLedgerID] = useState("");
    const [currentLedgerName, setCurrentLedgerName] = useState("");
    const [count, setCount] = useState(0);
    const [cacheResponse, setCacheResponse] = useState([]);
    const [editName, setEditName] = useState(0);
    const [editedLedgerName, setEditedLedgerName] = useState("");
    const [ledgerColumns, setLedgerColumns] = useState([]);
    const [inSettings, setInSettings] = useState(0);
    useEffect(() => {
        setLedgerRows([])
        getLedgers();
    }, [] //having the empty array as an initial value will cause the effect to run only once
    );

    const getLedgers = () => {
        const userIDCookie = document.cookie.split("=")[1]; 
        const token = userIDCookie.split(";")[0];
        const data = qs.stringify({
            ledgerName: undefined
        })
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:5000/api/Ledgers',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                const newLedgerNames = [];
                let ledgerData ="";
                
                for (let i = 0; i < response.data.length; i++) {
                    let ledgerName = response.data[i].ledgerName;
                    newLedgerNames.push(ledgerName);
                    ledgerData = response.data[0].ledgerData;
                    // response.data[0] is the first created ledger
                    if(response.data.ledgerData!=null && response.data[i].ledgerData.length !== 0) {
                        response.data[i].ledgerData.forEach(element => {
                            setLedgerRows(LedgerRows => [...LedgerRows, {
                                index: count,
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
                    }

                if(ledgerData!=null){
                    setLedgerRows(ledgerRows => [...ledgerRows,...ledgerData]);
                }
                setCacheResponse(response.data)
                setLedgerNames(newLedgerNames);

                console.log(currentLedgerName)
                //set current ledger to the first ledger as this
                //will be first by default

            })
            .catch((error) => {
                console.log(error);
            });
    };
    const changeLedger = (event) => {
        let ledgerData = ""

        cacheResponse.forEach(element => {
            //Check the cached Response to get the data from the ledger
            if(element.ledgerName === event.target.value) {
                ledgerData = element.ledgerData;
                setCurrentLedgerID(element._id);

            }
        })
        setCurrentLedgerName(event.target.value);
        console.log(currentLedgerName);
        if(ledgerData!==undefined){
            setLedgerRows([])
            ledgerData.forEach(element => {
                setLedgerRows(LedgerRows => [...LedgerRows, {
                    index: count,
                    date: element.date,
                    notes: element.notes,
                    debit: element.debit,
                    credit: element.credit,
                    balance: element.balance
                }]);
            })
        }else{
            setLedgerRows(LedgerRows => [{date: "", notes: "", debit: 0, credit: 0, balance: 0}])
            //adds a new blank row to the table as nothing exists for the ledger
        }
    }
    const onSave = () => {
        const userIDCookie = document.cookie.split("=")[1];
        const token = userIDCookie.split(";")[0];
        const ledgerName = editedLedgerName;

        if(editedLedgerName.length !==""){
            setCurrentLedgerName(ledgerName);
            setEditedLedgerName("");
        }

        console.log(currentLedgerName)
        for(let i = 0; i < ledgerRows.length; i++){
            if(ledgerRows[i].date == ""){
                alert("Please enter a date");
                return;
            }
            if(ledgerRows[i].notes == ""){
                alert("Please enter a notes");
                return;
            }
            if(ledgerRows[i].debit == ""){
                alert("Please enter a debit");
                return;
            }
            if(ledgerRows[i].credit == ""){
                alert("Please enter a credit");
                return;
            }
            if(ledgerRows[i].balance == ""){
                alert("Please enter a balance");
                return;
            }
        }
    
        let config = {
                method: 'put',
                maxBodyLength: Infinity,
                url: 'http://localhost:5000/api/Ledgers/update',
                headers: { 
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : {
                    _id: currentLedgerID,
                    ledgerData: ledgerRows,
                    ledgerName: currentLedgerName
                }
        };
        
        axios.request(config)
        .then((response) => {
        })
        .catch((error) => {
        });
    }

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
    }

    const changeLedgerName = (event) => {
        console.log(editedLedgerName);
        const updatedLedgerNames = [...ledgerNames];
        updatedLedgerNames.splice()
    }
    
    const onChangeCell = (event, index, key) => {
        const newRows = [...ledgerRows];
        newRows[index][key] = event.target.value;
        
        setLedgerRows(newRows);
    }
    return(
            <div>
            <div className="bg-white h-80 w-full m-auto rounded-xl shadow-2xl p-2 mb-5">
                <h1 className="text-5xl ">Your Accounts</h1>
                <hr />
                <p>Manage your accounts here</p>
                
            </div>
            
            <div className="bg-white pb-10 w-full m-auto p-4 rounded-xl shadow-2xl">
            <div className="w-auto h-auto mb-2 border p-1">
                    <h1 className='float-left text-xl p-1'> Select ledger: </h1>
                    <select className='ml-4 text-xl rounded-md p-1 w-1/4' onChange={changeLedger}>
                        { ledgerNames.map((ledgerName, index) => (
                            editName ? 
                            <option key={index} value={ledgerName}><input type="text" value={ledgerName}/></option>:
                            <option key={index} value={ledgerName}>{ledgerName}</option> 
                            ))}
                    </select>
                    <button className = "ml-4 text-xl rounded-md p-1 w-1/4" onClick={()=>setInSettings(!inSettings)}><AiOutlineEdit size={30}/></button>
                    <button className="bg-blue-500 hover:bg-blue-700 float-right"> New Ledger</button>
                </div>
                {inSettings ? 
                <div className="">
                    <div className=""> 
                        <input type="text" placeholder={""} onChange={(event)=>setEditedLedgerName(event.target.value)}/><button className="bg-blue-500 hover:bg-blue-700" onClick={()=>onSave()}>Save</button>
                    </div>
                </div>
                 : 
                <table class="table-auto w-11/12 h-auto">
                <thead>
                    <tr>
                        <th className="w-2/12 border-t border-l">Date</th>
                        <th className="w-5/12 border-t border-l">Notes</th>
                        <th className="w-1/12 border-t border-l">Debit</th>
                        <th className="w-1/12 border-t border-l">Credit</th>
                        <th className="w-2/12 border-t border-l border-r border-">Balance</th>
                        <button onClick={addRow}>+</button>

                    </tr>
                </thead>
                <tbody >
                {ledgerRows.map((row, index) => (
                <tr key={index} className="h-10" ref={event => (row[index] =event)}>
                    <td className="border-2">
                        <input value={row.date} onChange={(event)=>onChangeCell(event, index, "date")} type="date" className="w-full" required />    
                    </td>
                    <td className="border-2">
                        <input value={row.notes} onChange={(event)=>onChangeCell(event, index, "notes")} type="text" className="w-full" required />
                    </td>
                    <td className="border-2">  
                        <input value={row.debit} onChange={(event)=>onChangeCell(event, index, "debit")} type="number" className="w-full" required />
                    </td>
                    <td className="border-2">
                        <input value={row.credit} onChange={(event)=>onChangeCell(event, index, "credit")} type="number" className="w-full" required />
                    </td>
                    <td className="border-2">
                        <input value={row.balance} onChange={(event)=>onChangeCell(event, index, "balance")} type="number" className="w-full" required />
                    </td>
                    <td className="border-2 text-green-800 text-3xl">
                        <button onClick={deleteRow}>Delete</button>
                    </td>
                </tr>
                ))}
                </tbody>
                </table>   
            }
            <button onClick={onSave} className="bg-green-800 hover:bg-green-900 float-right rounded w-1/12">Save</button>          
                
            </div>
        </div>
        )
    }


export default Ledgers; 