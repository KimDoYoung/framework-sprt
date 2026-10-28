package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayMonthItemRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthItemTextRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/pay/mapper/pay11_month_item.xml — 급여 항목(S16) */
@Mapper
public interface PayMonthItemMapper {
    /** AS-IS selectByItemType */
    List<PayMonthItemRes> selectByItemType(@Param("monthId") Long monthId, @Param("itemType") String itemType);

    /** AS-IS updateModel (UPDATE 없으면 INSERT) */
    int updateModel(@Param("monthId") Long monthId, @Param("itemType") String itemType, @Param("itemCode") String itemCode,
                    @Param("itemAmt") Long itemAmt, @Param("monthItemId") Long monthItemId);

    /** 삭제 전 항목 코드 확인용 — 급여(monthId) 범위 */
    String selectItemCode(@Param("monthId") Long monthId, @Param("monthItemId") Long monthItemId);

    /** AS-IS deleteByMonthItemId (급여 범위 조건은 TOBE 추가) */
    int deleteByMonthItemId(@Param("monthId") Long monthId, @Param("monthItemId") Long monthItemId);

    /** AS-IS updateItemAmt (없으면 pay20_item의 구분으로 INSERT) */
    int updateItemAmt(@Param("monthId") Long monthId, @Param("itemCode") String itemCode, @Param("itemAmt") Long itemAmt);

    Long getIncomeTax(@Param("monthId") Long monthId);

    Long getLocalTax(@Param("payDate") LocalDate payDate, @Param("monthId") Long monthId);

    /** AS-IS getInsureAdjustModi → 'Y' 또는 실패 문구 */
    String getInsureAdjustModi(@Param("personId") Long personId, @Param("insureCode") String insureCode,
                               @Param("payDate") LocalDate payDate);

    /** AS-IS selectByText (S17 급여관리(항목별)) */
    List<PayMonthItemTextRes> selectByText(@Param("companyId") Long companyId, @Param("payCode") String payCode,
                                           @Param("payDate") LocalDate payDate, @Param("itemCode") String itemCode,
                                           @Param("searchText") String searchText);

    /** 일괄생성 항목이 급여항목에 있는지(TOBE 추가) */
    int countItem(@Param("itemType") String itemType, @Param("itemCode") String itemCode);

    /** AS-IS sys99_print.deleteByPersonId — 로그인 사용자의 지난 출력 자료 */
    int deletePrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId,
                    @Param("windowClassName") String windowClassName);

    /** AS-IS Sys99_Print.insertRdMonthItem L2542 — selectByText 목록을 sys99_print에 넣는다 */
    int insertPrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") Long groupId,
                    @Param("payCode") String payCode, @Param("payDate") LocalDate payDate,
                    @Param("itemCode") String itemCode, @Param("searchText") String searchText);
}
