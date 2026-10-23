package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizPersonRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BizPersonMapper {

    /** AS-IS biz02_person.selectByInternal */
    List<BizPersonRes> selectByInternal(@Param("companyId") Long companyId, @Param("promoId") Long promoId);

    /** AS-IS biz02_person.selectByExternal */
    List<BizPersonRes> selectByExternal(@Param("companyId") Long companyId, @Param("promoId") Long promoId);

    /** AS-IS biz02_person.selectByEmpId — 등록 여부(개수) */
    int countByEmpId(@Param("promoId") Long promoId, @Param("empId") Long empId);

    /** 내역이 로그인 회사 것인지 */
    int countPromo(@Param("companyId") Long companyId, @Param("promoId") Long promoId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS biz02_person.insert (직원) */
    int insertEmp(@Param("personId") long personId, @Param("promoId") Long promoId, @Param("empId") Long empId);

    /** AS-IS Biz02_Person.delete → UpdateDataModel.deleteModel — 로그인 회사 내역의 인원만 */
    int deleteById(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS biz04_provide_setup.selectByProvideContentCode → biz04_emp_set_yn (설정 없으면 null) */
    String selectEmpSetYn(@Param("companyId") Long companyId, @Param("provideContentCode") String provideContentCode);
}
