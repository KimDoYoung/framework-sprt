package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.OthersRes;
import kr.co.kfs.asseterp.biz.emp.dto.OthersSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** AS-IS server/emp/Emp02_Others (updateOne) + selectByText의 empOthersModel 컬럼 */
@Mapper
public interface EmpOthersMapper {
    /** 로그인 회사 사람의 기타정보. 사람이 없으면 null, 기타정보 행이 없으면 personId만 */
    OthersRes selectOthers(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS emp02_others.upsert */
    int upsertOthers(OthersSaveReq req);
}
