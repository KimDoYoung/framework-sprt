package kr.co.kfs.asseterp.oms.biz.emp.mapper;

import kr.co.kfs.asseterp.oms.biz.emp.dto.EmpTransRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.EmpTransRow;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonKey;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransSearchParam;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransHistoryRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransHistorySearchParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface EmpTransMapper {
    List<TransRes> searchByText(TransSearchParam param);

    /** 사원의 발령 (최근 순) */
    List<EmpTransRes> searchByPersonId(PersonKey key);

    int countByPerson(Long personId);

    Long selectPersonOfTrans(Long transId);

    Long selectNextId();

    int insert(EmpTransRow row);

    int update(EmpTransRow row);

    /** 겸직 파생 사원의 발령 (personId = 파생 사원) */
    int updateAddTitleTrans(EmpTransRow row);

    int delete(Long transId);

    /** 기간 내 발령 변경 (회사) */
    List<TransHistoryRes> searchHistory(TransHistorySearchParam param);
}
