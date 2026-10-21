package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.flt.dto.EmpInfoRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/flt/mapper/flt02_emp.xml (selectByCompanyId·selectByCompanyId2), flt01_company_std.xml (investLimitUnvisibleYn) */
@Mapper
public interface FltEmpMapper {

    /** AS-IS flt02_emp.selectByCompanyId (J07). noteFull=true는 엑셀용 selectByCompanyId2 — 준감인의견을 "있음"이 아니라 글 전체로 */
    List<EmpInfoRes> selectEmpInfos(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                    @Param("stdDate") String stdDate, @Param("searchText") String searchText,
                                    @Param("noteFull") boolean noteFull);

    /** AS-IS flt01_company_std.selectByDate 에서 investLimitUnvisibleYn — 기준관리가 없으면 null */
    Boolean selectInvestLimitUnvisible(@Param("companyId") Long companyId, @Param("stdDate") String stdDate);
}
