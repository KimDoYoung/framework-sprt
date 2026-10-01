package kr.co.kfs.asseterp.oms.biz.emp.mapper;

import kr.co.kfs.asseterp.oms.biz.emp.dto.TransInfoRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransInfoSearchParam;
import kr.co.kfs.asseterp.oms.biz.emp.dto.OrgPersonRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.OrgPersonSearchParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface EmpTransInfoMapper {
    List<TransInfoRes> searchByText(TransInfoSearchParam param);

    /** 사원 한 명의 현재 정보 (transCode '%': 겸직 제외 최근 발령) */
    TransInfoRes selectOneByPersonId(TransInfoSearchParam param);

    /** 조직(하위 포함) 기준일 사원 */
    List<OrgPersonRes> searchByOrg(OrgPersonSearchParam param);
}
