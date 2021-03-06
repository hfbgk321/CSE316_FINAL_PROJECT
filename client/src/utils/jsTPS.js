export class jsTPS_Transaction {
    constructor() {};
    doTransaction() {};
    undoTransaction () {};
  }
  
  
  export class SortRegionItems_Transaction extends jsTPS_Transaction{
      constructor(_id,oldRegionOrder,newRegionOrder,callback){
          super();
          this._id = _id;
          this.oldRegionOrder = oldRegionOrder;
          this.newRegionOrder = newRegionOrder;
          this.updateFunction = callback;
      }
  
      async doTransaction(){
          const {data} = await this.updateFunction({
              variables:{
                  _id:this._id,
                  children:this.newRegionOrder
              }
          });
  
          return data;
      }
  
      async undoTransaction(){
          const {data} = await this.updateFunction({
              variables:{
                  _id:this._id,
                  children:this.oldRegionOrder
              }
          })
          return data;
      }
  }
  
  
  export class UpdateRegionItems_Transaction extends jsTPS_Transaction{
      //opcodes 0 - delete 1-add
      constructor(pos,_id,region,opcode,addfunc,delfunc,isMap){
          super();
          this.pos = pos;
          this._id = _id;
          this.region = region;
          this.opcode = opcode;
          this.addfunc = addfunc;
          this.delfunc = delfunc;
          this.isMap = isMap;
          this.saved_data =[];
      }
  
      async doTransaction(){
          let {data} = this.opcode === 0 ? await this.delfunc({variables:{
              _id:this._id
          }}) : await this.addfunc({variables:{
              pos:this.pos,
              subregion: this.region,
              arr: this.saved_data,
              _id:this._id
          }});
  
          if(this.opcode === 1){
              if(this.isMap){
                  this._id = data.addSubregionToMap._id;
                  // this.saved_data = data.addSubregionToMap;
              }else{
                  this._id = data.addSubregion._id;
                  // this.saved_data = data.addSubregion;
              }
          }else{
              let arr = [];
              let temp = data.deleteSubregion;
              for(let x  = 0; x<temp.length;x++){
                  let temp_region = {
                      _id: temp[x]._id,
                      children:temp[x].children,
                      name:temp[x].name,
                      capital:temp[x].capital,
                      leader:temp[x].leader,
                      flag:temp[x].flag,
                      landmarks:temp[x].landmarks,
                      parent_id:temp[x].parent_id,
                      isParentAMap: temp[x].isParentAMap
                  }
                  arr.push(temp_region);
              }
              this.saved_data = arr;
          }
          return data;
      }
  
      async undoTransaction(){
          let {data} = this.opcode === 1 ? await this.delfunc({variables:{
              _id:this._id
          }}) : await this.addfunc({variables:{
              pos:this.pos,
              subregion: this.region,
              arr:this.saved_data,
              _id:this._id
          }});
  
          if(this.opcode === 0){
              if(this.isMap){
                  this._id = data.addSubregionToMap._id;
                  // this.saved_data = data.addSubregionToMap;
              }else{
                  this._id = data.addSubregion._id;
                  // this.saved_data = data.addSubregion;
              }
          }else{
              let arr = [];
              let temp = data.deleteSubregion;
              for(let x  = 0; x<temp.length;x++){
                  let temp_region = {
                      _id: temp[x]._id,
                      children:temp[x].children,
                      name:temp[x].name,
                      capital:temp[x].capital,
                      leader:temp[x].leader,
                      flag:temp[x].flag,
                      landmarks:temp[x].landmarks,
                      parent_id:temp[x].parent_id,
                      isParentAMap: temp[x].isParentAMap
                  }
                  arr.push(temp_region);
              }
              this.saved_data = arr;
          }
          return data;
      }
  }
  
  //adding or deleting landmarks
  //0 - add 1-delete
  //_id:$_id,landmark:$landmark <-+ pos
  export class EditLandmarks_Transaction extends jsTPS_Transaction{
      constructor(_id,pos,opcode,landmark,delfunction,addfunction){
          super();
          this._id = _id;
          this.pos = pos;
          this.opcode = opcode;
          this.deleteLandmark = delfunction;
          this.addLandmark = addfunction;
          this.landmark = landmark
      }
  
      async doTransaction(){
          let {data} = this.opcode == 0? await this.addLandmark({
              variables:{
                  _id:this._id,
                  pos:this.pos,
                  landmark:this.landmark
              }
          }): await this.deleteLandmark({
              variables:{
                  _id:this._id,
                  pos:this.pos
              }
          });
          return data;
      }
  
      async undoTransaction(){
          let {data} = this.opcode == 1? await this.addLandmark({
              variables:{
                  _id:this._id,
                  pos:this.pos,
                  landmark:this.landmark
              }
          }): await this.deleteLandmark({
              variables:{
                  _id:this._id,
                  pos:this.pos
              }
          });
          return data;
      }
  }
  
  //for changing name of landmark
  //_id:$_id,new_landmark:$new_landmark,pos:$pos
  export class UpdateLandmarks_Transaction extends jsTPS_Transaction{
      constructor(_id,old_landmark, new_landmark,pos,callback){
          super();
          this._id = _id;
          this.old_landmark = old_landmark;
          this.new_landmark = new_landmark;
          this.pos = pos;
          this.updateFunction = callback;
      }
  
  
      async doTransaction(){
          let {data} = await this.updateFunction({
              variables:{
                  _id:this._id,
                  new_landmark:this.new_landmark,
                  pos:this.pos
              }
          });
          return data;
      }
  
      async undoTransaction(){
          let {data} = await this.updateFunction({
              variables:{
                  _id:this._id,
                  new_landmark:this.old_landmark,
                  pos:this.pos
              }
          });
          return data;
      }
  }
  
  //_id:$_id,old_parent_id:$old_parent_id,new_parent_id:$new_parent_id
  export class EditParents_Transaction extends jsTPS_Transaction{
      constructor(_id, newParent,oldParent,callback){
          super();
          this._id = _id;
          this.newParent = newParent;
          this.oldParent = oldParent;
          this.updateFunction = callback;
      }
  
      async doTransaction(){
          let {data} = await this.updateFunction({variables:{
              _id:this._id,
              old_parent_id:this.oldParent,
              new_parent_id:this.newParent
          }});
          return data;
      }
  
  
      async undoTransaction(){
          let {data} = await this.updateFunction({variables:{
              _id:this._id,
              old_parent_id:this.newParent,
              new_parent_id:this.oldParent
          }});
          return data;
      }
  }
  
  
  export class EditItem_Transaction extends jsTPS_Transaction {
      constructor(_id, field, new_value,old_value, callback) {
          super();
          this._id = _id;
          this.field = field;
          this.old_value = old_value;
          this.new_value = new_value;
          this.update_function = callback;
          
      }	
  
      async doTransaction() {
          const { data } = await this.update_function({variables:{
              _id:this._id,
              field:this.field,
              value:this.new_value
          }});
          return data;
      }
  
      async undoTransaction() {
          const {data} = await this.update_function({variables:{
              _id:this._id,
              field:this.field,
              value:this.old_value
          }});
          return data;
      }
  }
  
  
  
  export class jsTPS {
    constructor() {
        // THE TRANSACTION STACK
        this.transactions = [];
        // KEEPS TRACK OF WHERE WE ARE IN THE STACK, THUS AFFECTING WHAT
        // TRANSACTION MAY BE DONE OR UNDONE AT ANY GIVEN TIME
        this.mostRecentTransaction = -1;
        // THESE VARIABLES CAN BE TURNED ON AND OFF TO SIGNAL THAT
        // DO AND UNDO OPERATIONS ARE BEING PERFORMED
        this.performingDo = false;
        this.performingUndo = false;
    }
    
    /**
     * Tests to see if the do (i.e. redo) operation is currently being
     * performed. If it is, true is returned, if not, false.
     * 
     * return true if the do (i.e. redo) operation is currently in the
     * process of executing, false otherwise.
     */
    isPerformingDo() {
        return this.performingDo;
    }
    
    /**
     * Tests to see if the undo operation is currently being
     * performed. If it is, true is returned, if not, false.
     * 
     * return true if the undo operation is currently in the
     * process of executing, false otherwise.
     */
    isPerformingUndo() {
        return this.performingUndo;
    }
    
    /**
     * This function adds the transaction argument to the top of
     * the transaction processing system stack and then executes it. Note that it does
     * When this method has completed transaction will be at the top 
     * of the stack, it will have been completed, and the counter have
     * been moved accordingly.
     * 
     * param transaction The custom transaction to be added to
     * the transaction processing system stack and executed.
     */
    addTransaction(transaction) {
        // ARE THERE OLD UNDONE TRANSACTIONS ON THE STACK THAT FIRST
        // NEED TO BE CLEARED OUT, i.e. ARE WE BRANCHING?
        if ((this.mostRecentTransaction < 0)|| (this.mostRecentTransaction < (this.transactions.length-1))) {
            for (let i = this.transactions.length-1; i > this.mostRecentTransaction; i--) {
                this.transactions.splice(i, 1);
            }
        }
  
        // AND NOW ADD THE TRANSACTION
        this.transactions.push(transaction);
        // AND EXECUTE IT
        // this.doTransaction();        
    }
  
    /**
     * This function executes the transaction at the location of the counter,
     * then moving the TPS counter. Note that this may be the transaction
     * at the top of the TPS stack or somewhere in the middle (i.e. a redo).
     */
     async doTransaction() {
    let retVal;
        if (this.hasTransactionToRedo()) {   
            this.performingDo = true;
            let transaction = this.transactions[this.mostRecentTransaction+1];
      retVal = await transaction.doTransaction();
      this.mostRecentTransaction++;
      this.performingDo = false;
            
        }
    return retVal;
    }
    
    /**
     * This function checks to see if there is a transaction to undo. If there
     * is it will return it, if not, it will return null.
     * 
     * return The transaction that would be executed if undo is performed, if
     * there is no transaction to undo, null is returned.
     */
    peekUndo() {
        if (this.hasTransactionToUndo()) {
            return this.transactions[this.mostRecentTransaction];
        }
        else
            return null;
    }
    
    /**
     * This function checks to see if there is a transaction to redo. If there
     * is it will return it, if not, it will return null.
     * 
     * return The transaction that would be executed if redo is performed, if
     * there is no transaction to undo, null is returned.
     */    
    peekDo() {
        if (this.hasTransactionToRedo()) {
            return this.transactions[this.mostRecentTransaction+1];
        }
        else
            return null;
    }
  
    /**
     * This function gets the most recently executed transaction on the 
     * TPS stack and undoes it, moving the TPS counter accordingly.
     */
     async undoTransaction() {
    let retVal;
        if (this.hasTransactionToUndo()) {
            this.performingUndo = true;
            let transaction = this.transactions[this.mostRecentTransaction];
      retVal = await transaction.undoTransaction();
            this.mostRecentTransaction--;
      this.performingUndo = false;
        }
    return(retVal);
    }
  
    /**
     * This method clears all transactions from the TPS stack
     * and resets the counter that keeps track of the location
     * of the top of the stack.
     */
    clearAllTransactions() {
        // REMOVE ALL THE TRANSACTIONS
  
        this.transactions = [];
        
        // MAKE SURE TO RESET THE LOCATION OF THE
        // TOP OF THE TPS STACK TOO
        this.mostRecentTransaction = -1;        
    }
    
    /**
     * Accessor method that returns the number of transactions currently
     * on the transaction stack. This includes those that may have been
     * done, undone, and redone.
     * 
     * return The number of transactions currently in the transaction stack.
     */
    getSize() {
        return this.transactions.length;
    }
    
    /**
     * This method returns the number of transactions currently in the
     * transaction stack that can be redone, meaning they have been added
     * and done, and then undone.
     * 
     * return The number of transactions in the stack that can be redone.
     */
    getRedoSize() {
        return this.getSize() - this.mostRecentTransaction - 1;
    }
  
    /**
     * This method returns the number of transactions currently in the 
     * transaction stack that can be undone.
     * 
     * return The number of transactions in the transaction stack that
     * can be undone.
     */
    getUndoSize() {
        return this.mostRecentTransaction + 1;
    }
    
    /**
     * This method tests to see if there is a transaction on the stack that
     * can be undone at the time this function is called.
     * 
     * return true if an undo operation is possible, false otherwise.
     */
    hasTransactionToUndo() {
        return this.mostRecentTransaction >= 0;
    }
    
    /**
     * This method tests to see if there is a transaction on the stack that
     * can be redone at the time this function is called.
     * 
     * return true if a redo operation is possible, false otherwise.
     */
    hasTransactionToRedo() {
        return this.mostRecentTransaction < (this.transactions.length-1);
    }
        
    /**
     * This method builds and returns a textual summary of the current
     * Transaction Processing System, this includes the toString of
     * each transaction in the stack.
     * 
     * return A textual summary of the TPS.
     */
    // toString() {
    //     let text = "<br>" +"--Number of Transactions: " + this.transactions.length + "</br>";
    //     text += "<br>" + "--Current Index on Stack: " + this.mostRecentTransaction + "</br>";
    //     text += "<br>" + "--Current Transaction Stack:" + "</br>";
    //     for (let i = 0; i <= this.mostRecentTransaction; i++) {
    //         let jsT = this.transactions[i];
    //         text += "<br>" + "----" + jsT.toString() + "</br>";
    //     }
    //     return text;
    // }
  }